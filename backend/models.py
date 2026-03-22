from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any

class User(BaseModel):
    email: EmailStr
    password: str  # This will be the hashed version in the DB
    created_at: datetime = Field(default_factory=datetime.utcnow)
    report_count: int = 0

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SavedReport(BaseModel):
    user_id: str
    title: str
    text_preview: str  # First 50 chars of analyzed text
    analysis: Dict[str, Any]
    raw_stats: Dict[str, Any]
    created_at: datetime = datetime.utcnow()

class AnalysisRequest(BaseModel):
    text: str
    title: str = "Untitled"
    # Contextual Fields
    style: str = "Academic"        # e.g., Tech Blog, Substack, Research Paper
    audience: str = "General"      # e.g., Experts, Students, SREs
    intent: str = "Informative"    # e.g., Provocative, Technical Deep-Dive, Persuasive