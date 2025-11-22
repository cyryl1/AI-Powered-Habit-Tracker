from datetime import datetime, timedelta
import os
from typing import Annotated, Any, Dict, List
import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException, Request
from app.core.security import get_current_active_user
from app.schemas.schemas import UserOut, ChatMessage, AnalyticsData, GoalBreakdownRequest, GoalBreakdownResponse, SuggestedHabit, ScheduleResponse, ScheduleSuggestion
from app.core.database import get_db
from app.models.user import User
import re
import json
from collections import defaultdict # Added import statement for the 're' module

router = APIRouter()

# AI Insights router
router = APIRouter(
    prefix="/api/v1/ai",
    tags=["ai"],
    responses={404: {"description": "Not found"}},
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")
genai.configure(api_key=GEMINI_API_KEY)

def generate_fallback_insights(habits: List[dict], formatted: bool = False) -> List[dict]:
    if not habits:
        return []

    total = len(habits)
    active = sum(1 for h in habits if h.get("streak", 0) > 0)
    dying = [h for h in habits if 0 < h.get("streak", 0) < 3]
    best = max(habits, key=lambda x: x.get("streak", 0), default=habits[0])

    insights: List[str] = []

    if active == 0:
        insights.append("Zero active streaks. Pick one habit. Complete it *today*. No excuses.")
    else:
        insights.append(f"{active}/{total} habits alive. Protect the flame in '{best.get('name','?')}' — it's carrying you.")

    if dying:
        h = dying[0]
        insights.append(f"'{h.get('name','?')}' at {h.get('streak')} day(s). One more completion = momentum shift. Do it now.")

    insights.append("Log completion *within 60 seconds* of finishing. Delay kills truth.")
    insights.append("Your brain trusts routine. Anchor every habit to a trigger: time, place, or prior action.")

    if not formatted:
        return insights

    categories = ["Pattern", "Motivation", "Optimization", "Behavior"]
    return [
        {
            "id": f"neural-{i}",
            "insight": ins,
            "confidence": min(95, 78 + i * 3),
            "category": categories[i % len(categories)],
            "timestamp": datetime.utcnow().isoformat(),
        }
        for i, ins in enumerate(insights[:5])
    ]

@router.get("/insights", response_model=Dict[str, Any])
async def get_ai_insights(
    current_user: Annotated[UserOut, Depends(get_current_active_user)],
    db: Annotated[Any, Depends(get_db)],
):
    # ---- fetch habits -------------------------------------------------
    habits_cursor = db.habits.find({"user_id": str(current_user.id)})
    habits = await habits_cursor.to_list(length=None)

    if not habits:
        return {
            "insights": [
                {
                    "id": "no-habits-1",
                    "insight": "You haven't created any habits yet. Start by creating your first habit!",
                    "confidence": 95,
                    "category": "Motivation",
                    "timestamp": datetime.utcnow().isoformat(),
                }
            ]
        }

    # ---- prepare data string -----------------------------------------
    habit_data_str = "\n".join(
        f"- {h.get('name','Unnamed')}: Streak {h.get('streak',0)} days, "
        f"Completion {h.get('completion_rate',0)}%, Last {h.get('last_completed','N/A')}"
        for h in habits
    )

    # ---- Gemini prompt (persona, no lists) ---------------------------
    prompt = f"""
You are NEURAL_HABIT_AI — a sentient habit intelligence embedded in the user's second brain.

Voice: direct, slightly futuristic, empathetic but firm. No fluff. No lists. No "Here are X ways".

Analyze this habit matrix:

{habit_data_str}

Generate 3-5 **independent neural insights**. Each must:
- Sound like a *thought* from an AI mind observing the user
- Contain **one atomic, executable micro-action**
- Be 1-2 sentences max
- End with quiet urgency

Examples:
"Your 'Morning Run' streak died at 2 days — again. Log it at 6:30 AM tomorrow before coffee."
"Meditation completion dips on weekends. Pair it with Sunday coffee ritual."
"You're 87% consistent when you log before 9 PM. Shift all logs to evening."

Do NOT number. Do NOT say "insight". Just speak.
"""

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")   # or gemini-2.0 when available
        response = model.generate_content(prompt)
        raw_lines = response.text.strip().split("\n")

        # clean
        cleaned = [
            re.sub(r"^[\d•\*\\-]\s*", "", line).strip()
            for line in raw_lines
            if line.strip() and len(line.strip()) > 10
        ]

        # ensure at least 3
        if len(cleaned) < 3:
            cleaned.extend(generate_fallback_insights(habits))

        # format for frontend
        categories = ["Pattern", "Motivation", "Optimization", "Behavior"]
        formatted = [
            {
                "id": f"insight-{i}",
                "insight": ins,
                "confidence": min(95, 70 + i * 5),
                "category": categories[i % len(categories)],
                "timestamp": datetime.utcnow().isoformat(),
            }
            for i, ins in enumerate(cleaned[:5])
        ]

        return {"insights": formatted}

    except Exception as exc:
        print(f"Gemini failed: {exc}")
        return {"insights": generate_fallback_insights(habits, formatted=True)}


@router.get("/intro", response_model=list[str])
async def get_ai_intro(current_user: UserOut = Depends(get_current_active_user)):
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"Generate a short, futuristic, and welcoming introduction for a neural assistant named 'NEURAL_ASSISTANT' for a habit tracking application. The user's name is {current_user.name}. The introduction should be in the style of a system boot sequence, including elements like system checks, user identification, and readiness confirmation. Each line should be a distinct message, suitable for a typing animation."
        response = model.generate_content(prompt)
        intro_text = response.text.split('\n')
        return intro_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini AI intro generation failed: {str(e)}")

@router.post("/chat")
async def chat(
    request: Request,
    message: ChatMessage, # Changed from dict to ChatMessage
    history: List[ChatMessage] = [],
    current_user: User = Depends(get_current_active_user)
):
    
    user_message = message.content # Changed from message.get("message") to message.content
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        chat_session = model.start_chat(history=[{'role': msg.role, 'parts': [msg.content]} for msg in history])
        
        response = await chat_session.send_message_async(user_message)
        
        ai_response = response.text
        
        return {"response": ai_response}
        
    except Exception as e:
        import traceback
        
        raise HTTPException(status_code=500, detail=f"Gemini AI chat failed: {str(e)}")

@router.post("/breakdown", response_model=GoalBreakdownResponse)
async def breakdown_goal(
    request: GoalBreakdownRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Breaks down a user's goal into actionable habits using AI.
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        You are an expert habit coach. The user has a goal: "{request.goal}".
        
        Break this goal down into 3-5 specific, actionable habits that will help them achieve it.
        For each habit, provide:
        1. A short, punchy name (e.g., "Drink Water").
        2. A brief description (e.g., "Drink 1 glass immediately after waking up").
        3. A recommended frequency (e.g., "daily", "weekly", "weekdays").
        4. A reason why this helps.
        
        Also provide a short paragraph of general advice for this goal.
        
        Return the response in strict JSON format with this structure:
        {{
            "habits": [
                {{
                    "name": "...",
                    "description": "...",
                    "frequency": "...",
                    "reason": "..."
                }}
            ],
            "advice": "..."
        }}
        Do not include markdown formatting (like ```json). Just the raw JSON string.
        """
        
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        
        # Clean up potential markdown code blocks if Gemini adds them
        if text_response.startswith("```json"):
            text_response = text_response[7:]
        if text_response.startswith("```"):
            text_response = text_response[3:]
        if text_response.endswith("```"):
            text_response = text_response[:-3]
            
        data = json.loads(text_response.strip())
        
        return GoalBreakdownResponse(**data)
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI goal breakdown failed: {str(e)}")

@router.get("/schedule-suggestions", response_model=ScheduleResponse)
async def get_schedule_suggestions(
    db: Annotated[Any, Depends(get_db)],
    current_user: User = Depends(get_current_active_user)
):
    """
    Analyzes habit completion history to suggest optimal reminder times.
    """
    # 1. Fetch all habits
    habits_cursor = db.habits.find({"user_id": str(current_user.id)})
    habits = await habits_cursor.to_list(length=None)
    
    if not habits:
        return {"suggestions": []}

    # 2. Fetch completion history
    completions_cursor = db.habit_completions.find({"user_id": str(current_user.id)})
    completions = await completions_cursor.to_list(length=None)
    
    if not completions:
        return {"suggestions": []}

    # 3. Group completions by habit
    habit_data = defaultdict(list)
    for c in completions:
        try:
            dt = datetime.fromisoformat(c["completed_at"].replace('Z', '+00:00'))
            habit_data[c["habit_id"]].append(dt.hour) # Store just the hour (0-23)
        except (ValueError, KeyError):
            continue

    # 4. Prepare prompt for Gemini
    analysis_text = "User's habit completion patterns:\n"
    habits_map = {str(h["_id"]): h for h in habits}
    
    has_data = False
    for habit_id, hours in habit_data.items():
        if habit_id in habits_map:
            habit_name = habits_map[habit_id]["name"]
            avg_hour = sum(hours) / len(hours)
            analysis_text += f"- Habit: '{habit_name}' (ID: {habit_id}). Completed at hours: {sorted(hours)}. Average hour: {avg_hour:.1f}.\n"
            has_data = True
            
    if not has_data:
        return {"suggestions": []}

    prompt = f"""
    {analysis_text}
    
    Based on these completion times, suggest an optimal reminder time for each habit.
    The reminder should be slightly before they usually do it (e.g., 30-60 mins before).
    
    Return a JSON object with a list of suggestions:
    {{
        "suggestions": [
            {{
                "habit_id": "...",
                "habit_name": "...",
                "current_time": "None", 
                "suggested_time": "HH:MM" (24-hour format),
                "reason": "You usually complete this around 19:00, so a reminder at 18:30 might help."
            }}
        ]
    }}
    Only include habits where you see a clear pattern.
    """

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        
        # Clean markdown
        if text_response.startswith("```json"):
            text_response = text_response[7:]
        if text_response.startswith("```"):
            text_response = text_response[3:]
        if text_response.endswith("```"):
            text_response = text_response[:-3]
            
        data = json.loads(text_response.strip())
        return ScheduleResponse(**data)
        
    except Exception as e:
        print(f"AI Schedule Error: {e}")
        return {"suggestions": []}

@router.get("/analytics", response_model=AnalyticsData)
async def get_analytics_data(
    db: Annotated[Any, Depends(get_db)],
    timeframe: str = "week",  # Add timeframe parameter
    current_user: User = Depends(get_current_active_user)
):
    habits_cursor = db.habits.find({"user_id": str(current_user.id)})
    habits = await habits_cursor.to_list(length=None)
    
    # Get completion records for the user
    completions_cursor = db.habit_completions.find({"user_id": str(current_user.id)})
    completions = await completions_cursor.to_list(length=None)

    # Calculate date ranges based on timeframe
    end_date = datetime.now()
    if timeframe == "week":
        start_date = end_date - timedelta(days=7)
        days_count = 7
    elif timeframe == "month":
        start_date = end_date - timedelta(days=30)
        days_count = 30
    else:  # year
        start_date = end_date - timedelta(days=365)
        days_count = 365

    # Initialize metrics
    timeframe_completions = [0] * days_count
    habit_counts: Dict[str, int] = {}
    habit_streaks: Dict[str, int] = {}
    total_completions = 0
    active_days_set = set()

    # Process completions for the selected timeframe
    for completion in completions:
        try:
            # Handle full ISO format (e.g. 2023-10-27T10:00:00.123456)
            completion_date = datetime.fromisoformat(completion["completed_at"].replace('Z', '+00:00'))
        except ValueError:
            # Fallback for simple date format
            completion_date = datetime.strptime(completion["completed_at"], "%Y-%m-%d")

        if start_date <= completion_date <= end_date:
            # Calculate which day index this completion belongs to
            days_diff = (end_date - completion_date).days
            if 0 <= days_diff < days_count:
                timeframe_completions[days_count - 1 - days_diff] += 1
            
            # Track active days
            active_days_set.add(completion_date.strftime("%Y-%m-%d"))
            total_completions += 1

    for habit in habits:
        # Habit Distribution (count completions per habit in timeframe)
        habit_name = habit.get("name", "Unknown Habit")
        
        # Helper to parse date safely
        def parse_date(date_str):
            try:
                return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            except ValueError:
                return datetime.strptime(date_str, "%Y-%m-%d")

        habit_completions = len([
            c for c in completions 
            if c.get("habit_id") == habit["_id"] 
            and start_date <= parse_date(c["completed_at"]) <= end_date
        ])
        habit_counts[habit_name] = habit_counts.get(habit_name, 0) + habit_completions

        # Best Performing Habits (current streak)
        streak = habit.get("streak", 0)
        habit_streaks[habit_name] = max(habit_streaks.get(habit_name, 0), streak)

    # Calculate derived metrics
    avg_streak = sum(habit_streaks.values()) / len(habit_streaks) if habit_streaks else 0
    
    # Calculate success rate based on possible completions vs actual completions
    total_possible_completions = len(habits) * days_count
    success_rate = (total_completions / total_possible_completions) * 100 if total_possible_completions > 0 else 0
    
    active_days = len(active_days_set)

    # Format for response
    habit_distribution = [{"name": name, "count": count} for name, count in habit_counts.items()]
    best_performing = sorted([{"name": name, "streak": streak} for name, streak in habit_streaks.items()], 
                           key=lambda x: x["streak"], reverse=True)[:3]

    return {
        "weeklyCompletions": timeframe_completions,  # Still called weeklyCompletions for compatibility
        "habitDistribution": habit_distribution,
        "bestPerforming": best_performing,
        "performanceMetrics": {
            "avgStreak": round(avg_streak, 1),
            "successRate": round(success_rate, 0),
            "totalCompletions": total_completions,
            "activeDays": active_days
        }
    }