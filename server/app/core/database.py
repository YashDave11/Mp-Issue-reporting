import os
import json
import threading
from typing import List, Dict, Any, Optional
from datetime import datetime

class LocalJSONDatabase:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.lock = threading.Lock()
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Files
        self.issues_file = os.path.join(self.data_dir, "issues.json")
        self.comments_file = os.path.join(self.data_dir, "comments.json")
        self.upvotes_file = os.path.join(self.data_dir, "upvotes.json")
        self.status_events_file = os.path.join(self.data_dir, "status_events.json")
        self.area_profiles_file = os.path.join(self.data_dir, "public_area_profiles.json")
        self.scoring_config_file = os.path.join(self.data_dir, "scoring_config.json")
        
        # Initialize default files if they don't exist
        self._init_files()
        
        # Seed issues if empty
        from app.core.seeder import seed_issues_data
        seed_issues_data(self)
        
    def _init_files(self):
        with self.lock:
            # Issues
            if not os.path.exists(self.issues_file):
                self._write_json(self.issues_file, {})
            # Comments
            if not os.path.exists(self.comments_file):
                self._write_json(self.comments_file, {})
            # Upvotes
            if not os.path.exists(self.upvotes_file):
                self._write_json(self.upvotes_file, {})
            # Status Events
            if not os.path.exists(self.status_events_file):
                self._write_json(self.status_events_file, {})
            # Area Profiles
            if not os.path.exists(self.area_profiles_file):
                self._seed_default_area_profiles()
            # Scoring Config
            if not os.path.exists(self.scoring_config_file):
                self._seed_default_scoring_config()

    def _read_json(self, filepath: str) -> Dict[str, Any]:
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def _write_json(self, filepath: str, data: Dict[str, Any]):
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def _seed_default_scoring_config(self):
        config = {
            "default": {
                "id": "default",
                "community_demand_weight": 0.30,
                "infrastructure_gap_weight": 0.25,
                "ai_urgency_weight": 0.20,
                "vulnerability_weight": 0.15,
                "recency_weight": 0.10,
                "updated_at": datetime.now().isoformat()
            }
        }
        self._write_json(self.scoring_config_file, config)

    def _seed_default_area_profiles(self):
        profiles = {
            "area_ward_7": {
                "id": "area_ward_7",
                "name": "Ward 7",
                "district": "Jodhpur",
                "state": "Rajasthan",
                "population_estimate": 12500,
                "vulnerability_index": 0.62,
                "road_condition_index": 0.43,
                "water_points_count": 4,
                "phc_count": 0,
                "lat": 26.2389,
                "lng": 73.0243
            },
            "area_ward_8": {
                "id": "area_ward_8",
                "name": "Ward 8",
                "district": "Jodhpur",
                "state": "Rajasthan",
                "population_estimate": 8200,
                "vulnerability_index": 0.35,
                "road_condition_index": 0.75,
                "water_points_count": 8,
                "phc_count": 1,
                "lat": 26.2410,
                "lng": 73.0280
            },
            "area_ward_9": {
                "id": "area_ward_9",
                "name": "Ward 9",
                "district": "Jodhpur",
                "state": "Rajasthan",
                "population_estimate": 15000,
                "vulnerability_index": 0.81,
                "road_condition_index": 0.30,
                "water_points_count": 2,
                "phc_count": 0,
                "lat": 26.2350,
                "lng": 73.0190
            },
            "area_ward_10": {
                "id": "area_ward_10",
                "name": "Ward 10",
                "district": "Jodhpur",
                "state": "Rajasthan",
                "population_estimate": 6000,
                "vulnerability_index": 0.20,
                "road_condition_index": 0.85,
                "water_points_count": 6,
                "phc_count": 2,
                "lat": 26.2450,
                "lng": 73.0320
            }
        }
        self._write_json(self.area_profiles_file, profiles)

    # --- Issues API ---
    def get_issue(self, issue_id: str) -> Optional[Dict[str, Any]]:
        with self.lock:
            issues = self._read_json(self.issues_file)
            return issues.get(issue_id)

    def get_all_issues(self) -> List[Dict[str, Any]]:
        with self.lock:
            issues = self._read_json(self.issues_file)
            return list(issues.values())

    def save_issue(self, issue_data: Dict[str, Any]):
        with self.lock:
            issues = self._read_json(self.issues_file)
            issues[issue_data["id"]] = issue_data
            self._write_json(self.issues_file, issues)

    # --- Comments API ---
    def get_issue_comments(self, issue_id: str) -> List[Dict[str, Any]]:
        with self.lock:
            all_comments = self._read_json(self.comments_file)
            return [c for c in all_comments.values() if c["issue_id"] == issue_id]

    def save_comment(self, comment_data: Dict[str, Any]):
        with self.lock:
            comments = self._read_json(self.comments_file)
            comments[comment_data["id"]] = comment_data
            self._write_json(self.comments_file, comments)

    # --- Upvotes API ---
    def get_issue_upvotes(self, issue_id: str) -> List[Dict[str, Any]]:
        with self.lock:
            upvotes = self._read_json(self.upvotes_file)
            return [u for u in upvotes.values() if u["issue_id"] == issue_id]

    def has_user_upvoted(self, issue_id: str, citizen_hash: str) -> bool:
        with self.lock:
            upvotes = self._read_json(self.upvotes_file)
            # Upvote unique key is issueId_citizenHash
            unique_key = f"{issue_id}_{citizen_hash}"
            return unique_key in upvotes

    def save_upvote(self, upvote_data: Dict[str, Any]):
        with self.lock:
            upvotes = self._read_json(self.upvotes_file)
            unique_key = f"{upvote_data['issue_id']}_{upvote_data['citizen_hash']}"
            upvotes[unique_key] = upvote_data
            self._write_json(self.upvotes_file, upvotes)

    # --- Status Events ---
    def get_status_events(self, issue_id: str) -> List[Dict[str, Any]]:
        with self.lock:
            events = self._read_json(self.status_events_file)
            return [e for e in events.values() if e["issue_id"] == issue_id]

    def save_status_event(self, event_data: Dict[str, Any]):
        with self.lock:
            events = self._read_json(self.status_events_file)
            events[event_data["id"]] = event_data
            self._write_json(self.status_events_file, events)

    # --- Public Area Profiles ---
    def get_all_area_profiles(self) -> List[Dict[str, Any]]:
        with self.lock:
            profiles = self._read_json(self.area_profiles_file)
            return list(profiles.values())

    def get_area_profile(self, area_id: str) -> Optional[Dict[str, Any]]:
        with self.lock:
            profiles = self._read_json(self.area_profiles_file)
            return profiles.get(area_id)

    # --- Scoring Config ---
    def get_scoring_config(self) -> Dict[str, Any]:
        with self.lock:
            configs = self._read_json(self.scoring_config_file)
            return configs.get("default", {})

    def save_scoring_config(self, config_data: Dict[str, Any]):
        with self.lock:
            configs = self._read_json(self.scoring_config_file)
            configs["default"] = config_data
            self._write_json(self.scoring_config_file, configs)

# Global DB Instance
db = LocalJSONDatabase()
