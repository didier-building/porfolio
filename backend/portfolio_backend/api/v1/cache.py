"""
Caching utilities for recruiter microsite
"""

import hashlib
from django.core.cache import cache
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


def get_jd_hash(job_description: str) -> str:
    """Generate SHA256 hash for job description caching"""
    # Normalize the job description
    normalized_jd = job_description.strip().lower()
    return hashlib.sha256(normalized_jd.encode('utf-8')).hexdigest()


def get_fit_analysis_cache_key(jd_hash: str) -> str:
    """Generate cache key for fit analysis"""
    return f"fit_analysis:{jd_hash}"


def cache_fit_analysis(job_description: str, analysis_result: Dict[Any, Any]) -> str:
    """Cache fit analysis result for 24 hours"""
    jd_hash = get_jd_hash(job_description)
    cache_key = get_fit_analysis_cache_key(jd_hash)
    
    # Cache for 24 hours
    cache.set(cache_key, analysis_result, timeout=86400)
    
    logger.info(f"Cached fit analysis with hash: {jd_hash[:8]}...")
    return jd_hash


def get_cached_fit_analysis(job_description: str) -> Optional[Dict[Any, Any]]:
    """Retrieve cached fit analysis if available"""
    jd_hash = get_jd_hash(job_description)
    cache_key = get_fit_analysis_cache_key(jd_hash)
    
    result = cache.get(cache_key)
    if result:
        logger.info(f"Cache hit for fit analysis: {jd_hash[:8]}...")
    else:
        logger.info(f"Cache miss for fit analysis: {jd_hash[:8]}...")
    
    return result


def get_chat_cache_key(query: str, context_hash: str) -> str:
    """Generate cache key for chat responses"""
    query_hash = hashlib.sha256(query.encode('utf-8')).hexdigest()[:16]
    return f"chat:{context_hash}:{query_hash}"


def cache_chat_response(query: str, context_hash: str, response: str) -> None:
    """Cache chat response for 1 hour"""
    cache_key = get_chat_cache_key(query, context_hash)
    cache.set(cache_key, response, timeout=3600)


def get_cached_chat_response(query: str, context_hash: str) -> Optional[str]:
    """Retrieve cached chat response if available"""
    cache_key = get_chat_cache_key(query, context_hash)
    return cache.get(cache_key)


def redact_jd_for_logs(job_description: str) -> str:
    """Redact job description for logging (800 chars + hash)"""
    if len(job_description) <= 800:
        return job_description
    
    redacted = job_description[:800] + "..."
    jd_hash = get_jd_hash(job_description)
    return f"{redacted} [hash:{jd_hash[:8]}]"


def get_portfolio_context_hash() -> str:
    """Generate hash for current portfolio context"""
    # This would include projects, skills, experience data
    # For now, use a simple timestamp-based approach
    from django.utils import timezone
    
    # Update this hash when portfolio content changes
    # For demo, we'll use a daily hash
    today = timezone.now().date().isoformat()
    return hashlib.sha256(f"portfolio_context_{today}".encode()).hexdigest()[:16]
