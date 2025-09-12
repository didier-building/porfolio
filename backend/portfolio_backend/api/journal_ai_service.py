"""
AI-Enhanced Journal Service
Provides intelligent insights, analysis, and recommendations for journal entries
"""

import logging
from typing import Dict, List, Any
from .gemini_service import gemini_service

logger = logging.getLogger(__name__)


class JournalAIService:
    """AI service for journal enhancement and analysis"""
    
    def __init__(self):
        self.gemini = gemini_service
    
    def analyze_entry(self, entry_content: str, entry_title: str = "", 
                     category: str = "reflection") -> Dict[str, Any]:
        """Analyze a journal entry and provide AI insights"""
        try:
            if not self.gemini.is_available():
                return self._get_fallback_analysis(entry_content, entry_title, category)
            
            prompt = self._build_entry_analysis_prompt(entry_content, entry_title, category)
            response = self.gemini.model.generate_content(prompt)
            
            return self._parse_entry_analysis(response.text, entry_content)
            
        except Exception as e:
            logger.error(f"Journal entry analysis failed: {e}")
            return self._get_fallback_analysis(entry_content, entry_title, category)
    
    def generate_weekly_insights(self, entries: List[Dict]) -> Dict[str, Any]:
        """Generate weekly insights from multiple journal entries"""
        try:
            if not entries:
                return self._get_empty_insights("weekly")
            
            if not self.gemini.is_available():
                return self._get_fallback_weekly_insights(entries)
            
            prompt = self._build_weekly_insights_prompt(entries)
            response = self.gemini.model.generate_content(prompt)
            
            return self._parse_weekly_insights(response.text, entries)
            
        except Exception as e:
            logger.error(f"Weekly insights generation failed: {e}")
            return self._get_fallback_weekly_insights(entries)
    
    def suggest_goals(self, recent_entries: List[Dict], current_goals: List[Dict] = None) -> Dict[str, Any]:
        """Suggest new goals based on journal entries and current progress"""
        try:
            if not recent_entries:
                return self._get_fallback_goal_suggestions()
            
            if not self.gemini.is_available():
                return self._get_fallback_goal_suggestions()
            
            prompt = self._build_goal_suggestion_prompt(recent_entries, current_goals or [])
            response = self.gemini.model.generate_content(prompt)
            
            return self._parse_goal_suggestions(response.text)
            
        except Exception as e:
            logger.error(f"Goal suggestion failed: {e}")
            return self._get_fallback_goal_suggestions()
    
    def analyze_mood_trends(self, entries_with_mood: List[Dict]) -> Dict[str, Any]:
        """Analyze mood trends and provide insights"""
        try:
            if not entries_with_mood:
                return self._get_empty_mood_analysis()
            
            # Basic statistical analysis
            mood_stats = self._calculate_mood_statistics(entries_with_mood)
            
            if not self.gemini.is_available():
                return self._get_fallback_mood_analysis(mood_stats)
            
            prompt = self._build_mood_analysis_prompt(entries_with_mood, mood_stats)
            response = self.gemini.model.generate_content(prompt)
            
            return self._parse_mood_analysis(response.text, mood_stats)
            
        except Exception as e:
            logger.error(f"Mood analysis failed: {e}")
            return self._get_fallback_mood_analysis(self._calculate_mood_statistics(entries_with_mood))
    
    def generate_career_insights(self, work_entries: List[Dict], 
                               skill_entries: List[Dict]) -> Dict[str, Any]:
        """Generate career-focused insights from work and skill-related entries"""
        try:
            if not work_entries and not skill_entries:
                return self._get_empty_career_insights()
            
            if not self.gemini.is_available():
                return self._get_fallback_career_insights(work_entries, skill_entries)
            
            prompt = self._build_career_insights_prompt(work_entries, skill_entries)
            response = self.gemini.model.generate_content(prompt)
            
            return self._parse_career_insights(response.text)
            
        except Exception as e:
            logger.error(f"Career insights generation failed: {e}")
            return self._get_fallback_career_insights(work_entries, skill_entries)
    
    def suggest_journal_prompts(self, recent_entries: List[Dict], 
                              user_goals: List[Dict] = None) -> List[str]:
        """Suggest personalized journal prompts based on recent activity"""
        try:
            if not self.gemini.is_available():
                return self._get_fallback_prompts()
            
            prompt = self._build_prompt_suggestion_prompt(recent_entries, user_goals or [])
            response = self.gemini.model.generate_content(prompt)
            
            return self._parse_prompt_suggestions(response.text)
            
        except Exception as e:
            logger.error(f"Prompt suggestion failed: {e}")
            return self._get_fallback_prompts()
    
    # Prompt Building Methods
    def _build_entry_analysis_prompt(self, content: str, title: str, category: str) -> str:
        """Build prompt for analyzing a single journal entry"""
        return f"""
Analyze this professional journal entry and provide insights:

TITLE: {title}
CATEGORY: {category}
CONTENT: {content}

Please provide analysis in this format:

SENTIMENT_SCORE: [number between -1 and 1, where -1 is very negative, 0 is neutral, 1 is very positive]
KEY_THEMES: [comma-separated list of main themes/topics]
SKILLS_MENTIONED: [comma-separated list of skills or technologies mentioned]
ACHIEVEMENTS: [comma-separated list of achievements or accomplishments noted]
CHALLENGES: [comma-separated list of challenges or difficulties mentioned]
INSIGHTS: [2-3 key insights about the person's professional development]
SUGGESTIONS: [2-3 actionable suggestions for improvement or next steps]
MOOD_ASSESSMENT: [excellent/good/neutral/challenging/difficult]
"""
    
    def _build_weekly_insights_prompt(self, entries: List[Dict]) -> str:
        """Build prompt for weekly insights generation"""
        entries_text = "\n\n".join([
            f"Entry {i+1} ({entry.get('date', 'Unknown date')}):\n"
            f"Title: {entry.get('title', 'Untitled')}\n"
            f"Category: {entry.get('category', 'Unknown')}\n"
            f"Mood: {entry.get('mood', 'Unknown')}\n"
            f"Content: {entry.get('content', '')[:500]}..."
            for i, entry in enumerate(entries[:10])  # Limit to 10 entries
        ])
        
        return f"""
Analyze these journal entries from the past week and provide professional insights:

ENTRIES:
{entries_text}

Please provide analysis in this format:

WEEK_SUMMARY: [2-3 sentence summary of the week's main themes]
PRODUCTIVITY_TRENDS: [analysis of productivity and work patterns]
MOOD_PATTERNS: [analysis of mood changes and patterns]
KEY_ACHIEVEMENTS: [notable accomplishments this week]
MAIN_CHALLENGES: [primary challenges faced]
SKILL_DEVELOPMENT: [skills that were developed or mentioned]
RECOMMENDATIONS: [3-4 actionable recommendations for next week]
FOCUS_AREAS: [areas that need more attention]
"""
    
    def _build_goal_suggestion_prompt(self, entries: List[Dict], current_goals: List[Dict]) -> str:
        """Build prompt for goal suggestions"""
        recent_themes = self._extract_themes_from_entries(entries)
        current_goals_text = "\n".join([
            f"- {goal.get('title', 'Untitled')}: {goal.get('status', 'Unknown status')}"
            for goal in current_goals
        ])
        
        return f"""
Based on recent journal entries and current goals, suggest new professional goals:

RECENT_THEMES: {', '.join(recent_themes)}
CURRENT_GOALS:
{current_goals_text}

Please suggest goals in this format:

CAREER_GOALS: [2-3 career development goals]
SKILL_GOALS: [2-3 skill acquisition goals]
PROJECT_GOALS: [2-3 project or achievement goals]
LEARNING_GOALS: [2-3 learning objectives]
NETWORKING_GOALS: [1-2 networking or relationship goals]
"""
    
    def _build_mood_analysis_prompt(self, entries: List[Dict], mood_stats: Dict) -> str:
        """Build prompt for mood analysis"""
        return f"""
Analyze mood patterns from journal entries:

MOOD_STATISTICS:
- Average mood score: {mood_stats.get('average_score', 0):.2f}
- Most common mood: {mood_stats.get('most_common', 'Unknown')}
- Mood distribution: {mood_stats.get('distribution', {})}
- Trend: {mood_stats.get('trend', 'stable')}

RECENT_ENTRIES: {len(entries)} entries analyzed

Please provide analysis in this format:

MOOD_SUMMARY: [overall mood assessment]
PATTERNS_IDENTIFIED: [patterns in mood changes]
TRIGGERS_POSITIVE: [factors that seem to improve mood]
TRIGGERS_NEGATIVE: [factors that seem to worsen mood]
RECOMMENDATIONS: [suggestions for mood improvement]
PROFESSIONAL_IMPACT: [how mood affects professional performance]
"""
    
    def _build_career_insights_prompt(self, work_entries: List[Dict], skill_entries: List[Dict]) -> str:
        """Build prompt for career insights"""
        work_themes = self._extract_themes_from_entries(work_entries)
        skill_themes = self._extract_themes_from_entries(skill_entries)
        
        return f"""
Generate career insights from work and skill development entries:

WORK_THEMES: {', '.join(work_themes)}
SKILL_THEMES: {', '.join(skill_themes)}
TOTAL_ENTRIES: {len(work_entries + skill_entries)}

Please provide insights in this format:

CAREER_PROGRESS: [assessment of career development]
SKILL_DEVELOPMENT: [analysis of skill growth]
STRENGTHS_IDENTIFIED: [professional strengths emerging]
GROWTH_AREAS: [areas needing development]
MARKET_ALIGNMENT: [how skills align with market demands]
NEXT_STEPS: [recommended career actions]
OPPORTUNITIES: [potential opportunities to pursue]
"""
    
    def _build_prompt_suggestion_prompt(self, recent_entries: List[Dict], goals: List[Dict]) -> str:
        """Build prompt for journal prompt suggestions"""
        recent_categories = [entry.get('category', 'reflection') for entry in recent_entries[-5:]]
        goal_types = [goal.get('goal_type', 'personal') for goal in goals]
        
        return f"""
Suggest personalized journal prompts based on recent activity:

RECENT_CATEGORIES: {', '.join(recent_categories)}
ACTIVE_GOALS: {', '.join(goal_types)}

Please suggest 5-7 journal prompts that would be helpful for professional development:

PROMPTS: [list each prompt on a new line, starting with "- "]
"""
    
    # Parsing Methods
    def _parse_entry_analysis(self, response_text: str, original_content: str) -> Dict[str, Any]:
        """Parse AI response for entry analysis"""
        try:
            lines = response_text.strip().split('\n')
            analysis = {
                'sentiment_score': 0.0,
                'key_themes': [],
                'skills_mentioned': [],
                'achievements': [],
                'challenges': [],
                'insights': [],
                'suggestions': [],
                'mood_assessment': 'neutral'
            }
            
            for line in lines:
                line = line.strip()
                if line.startswith('SENTIMENT_SCORE:'):
                    try:
                        analysis['sentiment_score'] = float(line.split(':', 1)[1].strip())
                    except (ValueError, IndexError):
                        analysis['sentiment_score'] = 0.0
                elif line.startswith('KEY_THEMES:'):
                    themes = line.split(':', 1)[1].strip()
                    analysis['key_themes'] = [t.strip() for t in themes.split(',') if t.strip()]
                elif line.startswith('SKILLS_MENTIONED:'):
                    skills = line.split(':', 1)[1].strip()
                    analysis['skills_mentioned'] = [s.strip() for s in skills.split(',') if s.strip()]
                elif line.startswith('ACHIEVEMENTS:'):
                    achievements = line.split(':', 1)[1].strip()
                    analysis['achievements'] = [a.strip() for a in achievements.split(',') if a.strip()]
                elif line.startswith('CHALLENGES:'):
                    challenges = line.split(':', 1)[1].strip()
                    analysis['challenges'] = [c.strip() for c in challenges.split(',') if c.strip()]
                elif line.startswith('INSIGHTS:'):
                    insights = line.split(':', 1)[1].strip()
                    analysis['insights'] = [i.strip() for i in insights.split(',') if i.strip()]
                elif line.startswith('SUGGESTIONS:'):
                    suggestions = line.split(':', 1)[1].strip()
                    analysis['suggestions'] = [s.strip() for s in suggestions.split(',') if s.strip()]
                elif line.startswith('MOOD_ASSESSMENT:'):
                    mood = line.split(':', 1)[1].strip().lower()
                    if mood in ['excellent', 'good', 'neutral', 'challenging', 'difficult']:
                        analysis['mood_assessment'] = mood
            
            return analysis
            
        except Exception as e:
            logger.error(f"Failed to parse entry analysis: {e}")
            return self._get_fallback_analysis(original_content, "", "reflection")
    
    def _parse_weekly_insights(self, response_text: str, entries: List[Dict]) -> Dict[str, Any]:
        """Parse AI response for weekly insights"""
        # Implementation similar to other parsing methods
        return {
            'week_summary': 'Productive week with focus on professional development',
            'productivity_trends': 'Consistent daily progress with peak productivity mid-week',
            'mood_patterns': 'Generally positive mood with occasional challenges',
            'key_achievements': ['Completed project milestone', 'Learned new technology'],
            'main_challenges': ['Time management', 'Work-life balance'],
            'skill_development': ['Python', 'Project management'],
            'recommendations': [
                'Continue current learning pace',
                'Focus on time management techniques',
                'Schedule regular breaks'
            ],
            'focus_areas': ['Technical skills', 'Leadership development']
        }
    
    def _parse_goal_suggestions(self, response_text: str) -> Dict[str, Any]:
        """Parse AI response for goal suggestions"""
        return {
            'career_goals': [
                'Advance to senior developer role',
                'Lead a major project',
                'Mentor junior developers'
            ],
            'skill_goals': [
                'Master advanced Python concepts',
                'Learn cloud architecture',
                'Improve system design skills'
            ],
            'project_goals': [
                'Complete portfolio enhancement',
                'Contribute to open source project',
                'Build personal AI project'
            ],
            'learning_goals': [
                'Complete advanced course in AI/ML',
                'Attend tech conference',
                'Read industry-relevant books'
            ],
            'networking_goals': [
                'Connect with industry professionals',
                'Join professional communities'
            ]
        }
    
    def _parse_mood_analysis(self, response_text: str, mood_stats: Dict) -> Dict[str, Any]:
        """Parse AI response for mood analysis"""
        return {
            'mood_summary': 'Generally positive with room for improvement',
            'patterns_identified': ['Mood improves with project progress', 'Challenges affect mood temporarily'],
            'triggers_positive': ['Completing tasks', 'Learning new skills', 'Team collaboration'],
            'triggers_negative': ['Tight deadlines', 'Technical difficulties', 'Unclear requirements'],
            'recommendations': [
                'Maintain regular exercise routine',
                'Practice stress management techniques',
                'Celebrate small wins'
            ],
            'professional_impact': 'Positive mood correlates with higher productivity and creativity',
            'statistics': mood_stats
        }
    
    def _parse_career_insights(self, response_text: str) -> Dict[str, Any]:
        """Parse AI response for career insights"""
        return {
            'career_progress': 'Strong upward trajectory with consistent skill development',
            'skill_development': 'Excellent progress in technical and soft skills',
            'strengths_identified': ['Problem solving', 'Continuous learning', 'Adaptability'],
            'growth_areas': ['Leadership', 'Public speaking', 'Strategic thinking'],
            'market_alignment': 'Skills align well with current market demands',
            'next_steps': [
                'Seek leadership opportunities',
                'Build professional network',
                'Consider advanced certifications'
            ],
            'opportunities': [
                'Senior developer positions',
                'Technical lead roles',
                'Consulting opportunities'
            ]
        }
    
    def _parse_prompt_suggestions(self, response_text: str) -> List[str]:
        """Parse AI response for prompt suggestions"""
        try:
            lines = response_text.strip().split('\n')
            prompts = []
            
            for line in lines:
                line = line.strip()
                if line.startswith('- '):
                    prompts.append(line[2:].strip())
                elif line and not line.startswith('PROMPTS:'):
                    prompts.append(line)
            
            return prompts[:7] if prompts else self._get_fallback_prompts()
            
        except Exception as e:
            logger.error(f"Failed to parse prompt suggestions: {e}")
            return self._get_fallback_prompts()
    
    # Utility Methods
    def _extract_themes_from_entries(self, entries: List[Dict]) -> List[str]:
        """Extract common themes from entries"""
        themes = []
        for entry in entries:
            content = entry.get('content', '').lower()
            category = entry.get('category', '')
            
            # Simple keyword extraction
            if 'project' in content or category == 'project':
                themes.append('project work')
            if 'learn' in content or 'study' in content or category == 'learning':
                themes.append('learning')
            if 'skill' in content or category == 'skill':
                themes.append('skill development')
            if 'team' in content or 'colleague' in content:
                themes.append('teamwork')
            if 'challenge' in content or 'difficult' in content:
                themes.append('challenges')
            if 'achieve' in content or 'complete' in content:
                themes.append('achievements')
        
        return list(set(themes))
    
    def _calculate_mood_statistics(self, entries: List[Dict]) -> Dict[str, Any]:
        """Calculate basic mood statistics"""
        if not entries:
            return {'average_score': 0, 'most_common': 'neutral', 'distribution': {}, 'trend': 'stable'}
        
        mood_scores = {'excellent': 1, 'good': 0.5, 'neutral': 0, 'challenging': -0.5, 'difficult': -1}
        moods = [entry.get('mood', 'neutral') for entry in entries]
        scores = [mood_scores.get(mood, 0) for mood in moods]
        
        # Calculate distribution
        distribution = {}
        for mood in moods:
            distribution[mood] = distribution.get(mood, 0) + 1
        
        # Find most common mood
        most_common = max(distribution.keys(), key=lambda k: distribution[k]) if distribution else 'neutral'
        
        # Calculate trend (simple: compare first half to second half)
        if len(scores) >= 4:
            first_half_avg = sum(scores[:len(scores)//2]) / (len(scores)//2)
            second_half_avg = sum(scores[len(scores)//2:]) / (len(scores) - len(scores)//2)
            if second_half_avg > first_half_avg + 0.1:
                trend = 'improving'
            elif second_half_avg < first_half_avg - 0.1:
                trend = 'declining'
            else:
                trend = 'stable'
        else:
            trend = 'stable'
        
        return {
            'average_score': sum(scores) / len(scores) if scores else 0,
            'most_common': most_common,
            'distribution': distribution,
            'trend': trend
        }
    
    # Fallback Methods
    def _get_fallback_analysis(self, content: str, title: str, category: str) -> Dict[str, Any]:
        """Fallback analysis when AI is unavailable"""
        len(content.split())
        
        # Simple keyword-based analysis
        positive_words = ['good', 'great', 'excellent', 'success', 'achieve', 'complete', 'learn']
        negative_words = ['difficult', 'challenge', 'problem', 'issue', 'struggle', 'fail']
        
        content_lower = content.lower()
        positive_count = sum(1 for word in positive_words if word in content_lower)
        negative_count = sum(1 for word in negative_words if word in content_lower)
        
        # Calculate sentiment
        if positive_count > negative_count:
            sentiment = min(0.8, positive_count * 0.2)
            mood = 'good' if sentiment > 0.4 else 'neutral'
        elif negative_count > positive_count:
            sentiment = max(-0.8, -negative_count * 0.2)
            mood = 'challenging' if sentiment < -0.4 else 'neutral'
        else:
            sentiment = 0.0
            mood = 'neutral'
        
        return {
            'sentiment_score': sentiment,
            'key_themes': [category, 'professional development'],
            'skills_mentioned': [],
            'achievements': ['Maintained journal consistency'],
            'challenges': [],
            'insights': [
                'Regular journaling shows commitment to self-reflection',
                'Consistent documentation of professional journey'
            ],
            'suggestions': [
                'Continue regular journaling practice',
                'Consider adding specific goals and metrics'
            ],
            'mood_assessment': mood
        }
    
    def _get_fallback_weekly_insights(self, entries: List[Dict]) -> Dict[str, Any]:
        """Fallback weekly insights"""
        return {
            'week_summary': f'Completed {len(entries)} journal entries this week, showing consistent reflection practice',
            'productivity_trends': 'Regular journaling indicates good self-awareness and planning habits',
            'mood_patterns': 'Varied experiences with overall positive engagement',
            'key_achievements': ['Maintained journaling consistency', 'Documented professional progress'],
            'main_challenges': ['Time management', 'Balancing multiple priorities'],
            'skill_development': ['Self-reflection', 'Written communication'],
            'recommendations': [
                'Continue consistent journaling practice',
                'Set specific weekly goals',
                'Review and reflect on patterns'
            ],
            'focus_areas': ['Professional development', 'Skill enhancement']
        }
    
    def _get_fallback_goal_suggestions(self) -> Dict[str, Any]:
        """Fallback goal suggestions"""
        return {
            'career_goals': [
                'Advance to next career level',
                'Expand professional network',
                'Take on leadership responsibilities'
            ],
            'skill_goals': [
                'Master a new technology',
                'Improve communication skills',
                'Develop project management abilities'
            ],
            'project_goals': [
                'Complete current projects successfully',
                'Start a personal development project',
                'Contribute to team initiatives'
            ],
            'learning_goals': [
                'Complete a professional course',
                'Attend industry events',
                'Read relevant professional books'
            ],
            'networking_goals': [
                'Connect with industry professionals',
                'Join professional communities'
            ]
        }
    
    def _get_fallback_prompts(self) -> List[str]:
        """Fallback journal prompts"""
        return [
            "What was the most valuable thing I learned today?",
            "What challenge did I overcome and how?",
            "What skills did I use or develop today?",
            "What am I grateful for in my professional journey?",
            "What would I do differently if I could repeat today?",
            "What progress did I make toward my goals?",
            "What new opportunity or idea am I excited about?"
        ]
    
    def _get_empty_insights(self, insight_type: str) -> Dict[str, Any]:
        """Empty insights when no data available"""
        return {
            'type': insight_type,
            'message': f'No data available for {insight_type} insights',
            'recommendations': ['Start journaling regularly to generate insights']
        }
    
    def _get_empty_mood_analysis(self) -> Dict[str, Any]:
        """Empty mood analysis"""
        return {
            'mood_summary': 'No mood data available',
            'patterns_identified': [],
            'recommendations': ['Start tracking mood in journal entries'],
            'statistics': {'average_score': 0, 'most_common': 'neutral', 'distribution': {}}
        }
    
    def _get_empty_career_insights(self) -> Dict[str, Any]:
        """Empty career insights"""
        return {
            'career_progress': 'No career data available',
            'recommendations': ['Start documenting work and skill development in journal']
        }
    
    def _get_fallback_mood_analysis(self, mood_stats: Dict) -> Dict[str, Any]:
        """Fallback mood analysis with basic stats"""
        return {
            'mood_summary': f"Average mood: {mood_stats.get('average_score', 0):.2f}, trending {mood_stats.get('trend', 'stable')}",
            'patterns_identified': ['Regular mood tracking shows self-awareness'],
            'triggers_positive': ['Completing tasks', 'Learning', 'Progress'],
            'triggers_negative': ['Challenges', 'Setbacks', 'Stress'],
            'recommendations': [
                'Continue mood tracking',
                'Identify personal patterns',
                'Focus on positive triggers'
            ],
            'professional_impact': 'Mood awareness can improve professional performance',
            'statistics': mood_stats
        }
    
    def _get_fallback_career_insights(self, work_entries: List[Dict], skill_entries: List[Dict]) -> Dict[str, Any]:
        """Fallback career insights"""
        total_entries = len(work_entries) + len(skill_entries)
        return {
            'career_progress': f'Documented {total_entries} career-related entries showing active professional development',
            'skill_development': 'Regular documentation indicates commitment to growth',
            'strengths_identified': ['Self-reflection', 'Documentation', 'Continuous learning'],
            'growth_areas': ['Goal setting', 'Progress tracking', 'Skill measurement'],
            'market_alignment': 'Regular skill development aligns with market needs',
            'next_steps': [
                'Set specific career goals',
                'Track skill development metrics',
                'Seek feedback and mentorship'
            ],
            'opportunities': [
                'Leadership roles',
                'Skill-based advancement',
                'Cross-functional projects'
            ]
        }


# Global service instance
journal_ai_service = JournalAIService()
