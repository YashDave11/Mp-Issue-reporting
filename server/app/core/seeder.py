from datetime import datetime, timedelta
import random

def seed_issues_data(db):
    issues = db._read_json(db.issues_file)
    if len(issues) > 0:
        return # Already seeded
        
    print("Seeding issues database with 15 realistic constituency records...")
    
    # Locality Profiles to link to
    localities = {
        "Ward 7": {"id": "area_ward_7", "vulnerability": 0.62, "infra_gap": 0.57}, # 1 - 0.43 road index
        "Ward 8": {"id": "area_ward_8", "vulnerability": 0.35, "infra_gap": 0.25},
        "Ward 9": {"id": "area_ward_9", "vulnerability": 0.81, "infra_gap": 0.70},
        "Ward 10": {"id": "area_ward_10", "vulnerability": 0.20, "infra_gap": 0.15}
    }
    
    # 15 realistic complaints
    raw_complaints = [
        {
            "id": "issue_001",
            "title": "Broken road near Ward 7 school",
            "raw_text": "Sadak toot gayi hai school ke paas, bache gir jate hain",
            "normalized_text": "Road near the school is broken, children fall down",
            "summary": "Damaged main road leading to Ward 7 primary school. Large potholes causing safety hazards for students.",
            "language": "hi",
            "category": "roads",
            "location_name": "Ward 7",
            "lat": 26.2389,
            "lng": 73.0243,
            "urgency": 0.78,
            "status": "open",
            "upvotes": 28,
            "comments_count": 4,
            "created_days_ago": 12
        },
        {
            "id": "issue_002",
            "title": "Water logging in Ward 9 market",
            "raw_text": "Bazaar me pani jama ho jata hai thodi si barish me",
            "normalized_text": "Water accumulates in the market even with light rain",
            "summary": "Blocked storm drains in Ward 9 commercial area causing severe flooding and road blockages during light rainfall.",
            "language": "hi",
            "category": "water",
            "location_name": "Ward 9",
            "lat": 26.2352,
            "lng": 73.0195,
            "urgency": 0.85,
            "status": "under_review",
            "upvotes": 42,
            "comments_count": 6,
            "created_days_ago": 8
        },
        {
            "id": "issue_003",
            "title": "Damaged primary school roof in Ward 7",
            "raw_text": "Primary school ki chatt tooti hui hai, barish me paani tapakta hai",
            "normalized_text": "Primary school roof is broken, water drips during rain",
            "summary": "Leaking and structurally unstable roof of the Government Primary School in Ward 7. Safety risk for 150 students.",
            "language": "hi",
            "category": "school infrastructure",
            "location_name": "Ward 7",
            "lat": 26.2375,
            "lng": 73.0225,
            "urgency": 0.90,
            "status": "planned",
            "upvotes": 35,
            "comments_count": 3,
            "created_days_ago": 18
        },
        {
            "id": "issue_004",
            "title": "Garbage heap near Ward 8 community park",
            "raw_text": "Park ke paas kachra jama ho gaya hai, bahut badboo aati hai",
            "normalized_text": "Garbage has accumulated near the park, it smells a lot",
            "summary": "Unauthorized dumping site near the community park in Ward 8. Breeding ground for mosquitoes and foul odor.",
            "language": "hi",
            "category": "sanitation",
            "location_name": "Ward 8",
            "lat": 26.2415,
            "lng": 73.0290,
            "urgency": 0.55,
            "status": "in_progress",
            "upvotes": 12,
            "comments_count": 2,
            "created_days_ago": 5
        },
        {
            "id": "issue_005",
            "title": "No drinking water facility in Ward 9 primary health center",
            "raw_text": "PHC clinic me peene ke paani ka intezam nahi hai",
            "normalized_text": "There is no drinking water arrangement in the PHC clinic",
            "summary": "Lack of potable water filtration systems at the Ward 9 local clinic. Patients and staff forced to bring outside water.",
            "language": "hi",
            "category": "health",
            "location_name": "Ward 9",
            "lat": 26.2341,
            "lng": 73.0180,
            "urgency": 0.70,
            "status": "open",
            "upvotes": 19,
            "comments_count": 1,
            "created_days_ago": 15
        },
        {
            "id": "issue_006",
            "title": "Dark street near Ward 10 bus stop",
            "raw_text": "Bus stand ke paas street lights nahi jal rahi hain, raat ko darr lagta hai",
            "normalized_text": "Street lights are not working near the bus stand, it feels scary at night",
            "summary": "Unlit streets around the Ward 10 transit hub due to broken solar light bulbs. High safety risk for women and elderly.",
            "language": "hi",
            "category": "public safety",
            "location_name": "Ward 10",
            "lat": 26.2455,
            "lng": 73.0335,
            "urgency": 0.65,
            "status": "resolved",
            "upvotes": 15,
            "comments_count": 2,
            "created_days_ago": 25
        },
        {
            "id": "issue_007",
            "title": "Clogged sewer line causing overflow in Ward 7 lane",
            "raw_text": "Gali me ganda paani beh raha hai, gutter jaam hai",
            "normalized_text": "Dirty water is flowing in the street, gutter is jammed",
            "summary": "Overflowing sewer line in Street 3, Ward 7, flooding residential doorsteps with black water.",
            "language": "hi",
            "category": "sanitation",
            "location_name": "Ward 7",
            "lat": 26.2392,
            "lng": 73.0255,
            "urgency": 0.80,
            "status": "open",
            "upvotes": 31,
            "comments_count": 5,
            "created_days_ago": 4
        },
        {
            "id": "issue_008",
            "title": "Broken handpump near Ward 9 community hall",
            "raw_text": "Community hall ke paas ka handpump 2 mahine se kharab hai",
            "normalized_text": "The handpump near the community hall has been broken for 2 months",
            "summary": "Non-functioning handpump near the public hall in Ward 9, cutting off a vital water source for 50 nearby households.",
            "language": "hi",
            "category": "water",
            "location_name": "Ward 9",
            "lat": 26.2360,
            "lng": 73.0208,
            "urgency": 0.60,
            "status": "open",
            "upvotes": 25,
            "comments_count": 3,
            "created_days_ago": 30
        },
        {
            "id": "issue_009",
            "title": "Potholes on Jodhpur Bypass Road (Ward 8)",
            "raw_text": "Bypass road par bade bade gaddhe ho gaye hain, bike girne ka khatra hai",
            "normalized_text": "There are huge potholes on the bypass road, risk of bike falling",
            "summary": "Multiple deep potholes on the main bypass corridor passing through Ward 8, slowing traffic and causing accidents.",
            "language": "hi",
            "category": "roads",
            "location_name": "Ward 8",
            "lat": 26.2405,
            "lng": 73.0270,
            "urgency": 0.72,
            "status": "under_review",
            "upvotes": 50,
            "comments_count": 8,
            "created_days_ago": 7
        },
        {
            "id": "issue_010",
            "title": "Lack of benches and toilets in Ward 10 primary school",
            "raw_text": "School me bacho ke baithne ke liye benches aur toilets kharab hain",
            "normalized_text": "Benches for children to sit and toilets are in bad shape in the school",
            "summary": "Broken desks and sanitation issues in Ward 10 girls' school, impacting daily attendance and basic comfort.",
            "language": "hi",
            "category": "school infrastructure",
            "location_name": "Ward 10",
            "lat": 26.2442,
            "lng": 73.0310,
            "urgency": 0.68,
            "status": "planned",
            "upvotes": 22,
            "comments_count": 2,
            "created_days_ago": 14
        },
        {
            "id": "issue_011",
            "title": "No doctor at Ward 7 Primary Health Sub-Center",
            "raw_text": "Ward 7 ke health sub-center me koi doctor nahi aata hai, sirf compounder hota hai",
            "normalized_text": "No doctor comes to Ward 7 health sub-center, only compounder is present",
            "summary": "Unstaffed health sub-center leaving locals without professional medical advice, forcing travel to city hospitals.",
            "language": "hi",
            "category": "health",
            "location_name": "Ward 7",
            "lat": 26.2382,
            "lng": 73.0230,
            "urgency": 0.82,
            "status": "open",
            "upvotes": 47,
            "comments_count": 7,
            "created_days_ago": 20
        },
        {
            "id": "issue_012",
            "title": "Open drain next to children play park in Ward 9",
            "raw_text": "Khelne ke park ke paas khula naala hai, bache gir sakte hain",
            "normalized_text": "There is an open drain near the playing park, children can fall in",
            "summary": "Hazardous open drainage canal directly bordering the community children's playground in Ward 9.",
            "language": "hi",
            "category": "public safety",
            "location_name": "Ward 9",
            "lat": 26.2345,
            "lng": 73.0185,
            "urgency": 0.88,
            "status": "open",
            "upvotes": 58,
            "comments_count": 9,
            "created_days_ago": 3
        },
        {
            "id": "issue_013",
            "title": "Water supply contains dirt in Ward 10 lane",
            "raw_text": "Nal me ganda pani aa raha hai pee nahi sakte",
            "normalized_text": "Dirty water is coming from the tap, cannot drink it",
            "summary": "Contaminated public drinking water supply in Gali 5, Ward 10. Turbid water triggering water-borne illness fears.",
            "language": "hi",
            "category": "water",
            "location_name": "Ward 10",
            "lat": 26.2460,
            "lng": 73.0340,
            "urgency": 0.79,
            "status": "under_review",
            "upvotes": 17,
            "comments_count": 3,
            "created_days_ago": 6
        },
        {
            "id": "issue_014",
            "title": "Stagnant waste-water pooling near Ward 8 residences",
            "raw_text": "Gharo ke paas keechad aur pani jama hai, machar ho rahe hain",
            "normalized_text": "Mud and water is pooled near houses, mosquitoes are breeding",
            "summary": "Large stagnant pool of sewage overflow on a vacant plot in Ward 8, attracting pests and creating unhygienic conditions.",
            "language": "hi",
            "category": "sanitation",
            "location_name": "Ward 8",
            "lat": 26.2422,
            "lng": 73.0305,
            "urgency": 0.62,
            "status": "open",
            "upvotes": 10,
            "comments_count": 1,
            "created_days_ago": 9
        },
        {
            "id": "issue_015",
            "title": "Damaged school boundary wall in Ward 9",
            "raw_text": "School ki boundary deewar toot gayi hai, kutton ka darr rehta hai",
            "normalized_text": "School boundary wall is broken, fear of stray dogs entering",
            "summary": "Collapsed section of boundary wall at the Government High School in Ward 9, allowing stray animals to wander in.",
            "language": "hi",
            "category": "school infrastructure",
            "location_name": "Ward 9",
            "lat": 26.2365,
            "lng": 73.0215,
            "urgency": 0.70,
            "status": "in_progress",
            "upvotes": 20,
            "comments_count": 3,
            "created_days_ago": 11
        }
    ]
    
    # We will seed these issues, comments and upvotes
    for c in raw_complaints:
        # Calculate scores
        # Recency score = 1.0 - (created_days_ago / 30)
        recency_val = max(0.0, 1.0 - (c["created_days_ago"] / 30.0))
        
        loc_data = localities[c["location_name"]]
        vulnerability_val = loc_data["vulnerability"]
        infra_gap_val = loc_data["infra_gap"]
        
        # Community demand = min(1.0, (upvotes + 2 * comments) / 25)
        demand_val = min(1.0, (c["upvotes"] + 2.0 * c["comments_count"]) / 25.0)
        
        urgency_val = c["urgency"]
        
        # Priority score formula
        p_score = (
            0.30 * demand_val +
            0.25 * infra_gap_val +
            0.20 * urgency_val +
            0.15 * vulnerability_val +
            0.10 * recency_val
        )
        
        created_time = (datetime.now() - timedelta(days=c["created_days_ago"])).isoformat()
        
        issue_record = {
            "id": c["id"],
            "title": c["title"],
            "raw_text": c["raw_text"],
            "normalized_text": c["normalized_text"],
            "summary": c["summary"],
            "language": c["language"],
            "category": c["category"],
            "sub_category": None,
            "source_channel": "web",
            "reporter_hash": f"reporter_{random.randint(1000, 9999)}",
            "location_name": c["location_name"],
            "ward": c["location_name"],
            "district": "Jodhpur",
            "state": "Rajasthan",
            "lat": c["lat"],
            "lng": c["lng"],
            "dedupe_status": "unique",
            "duplicate_of": None,
            "duplicate_confidence": None,
            "ai_urgency_score": urgency_val,
            "priority_score": round(p_score, 2),
            "upvote_count": c["upvotes"],
            "comment_count": c["comments_count"],
            "unique_supporter_count": c["upvotes"] + 1,
            "status": c["status"],
            "visibility": "public",
            "media_url": None,
            "created_at": created_time,
            "updated_at": created_time,
            "score_breakdown": {
                "community_demand": round(demand_val, 2),
                "infrastructure_gap": round(infra_gap_val, 2),
                "ai_urgency": round(urgency_val, 2),
                "vulnerability": round(vulnerability_val, 2),
                "recency": round(recency_val, 2)
            }
        }
        
        issues[c["id"]] = issue_record
        
        # Seed upvotes for this issue
        for i in range(c["upvotes"]):
            u_id = f"upvote_{c['id']}_{i}"
            citizen_hash = f"citizen_{hash(c['id']) + i}"
            upvote_record = {
                "id": u_id,
                "issue_id": c["id"],
                "citizen_hash": citizen_hash,
                "created_at": created_time
            }
            db.save_upvote(upvote_record)
            
        # Seed comments for this issue
        sample_comments = [
            "This has been a problem for months.",
            "Water logs here and it is a major breeding ground for mosquitoes.",
            "We reported it to the local ward office but no action was taken.",
            "I fell here yesterday while dropping my kid to school. Unsafe!",
            "During the rain, this area is completely blocked.",
            "Stray dogs gathered around the garbage heap, very scary.",
            "Please fix this as soon as possible, it affects all families in the lane.",
            "Doctors rarely visit, and the medical store is often closed.",
            "Open drains are a death trap for children. Need immediate action!"
        ]
        
        random.shuffle(sample_comments)
        for i in range(c["comments_count"]):
            comm_id = f"comment_{c['id']}_{i}"
            comment_record = {
                "id": comm_id,
                "issue_id": c["id"],
                "text": sample_comments[i % len(sample_comments)],
                "raw_text": sample_comments[i % len(sample_comments)],
                "normalized_text": sample_comments[i % len(sample_comments)],
                "language": "en",
                "voice_url": None,
                "image_url": None,
                "author_hash": f"citizen_{random.randint(10000, 99999)}",
                "ai_note": "Community validation comment",
                "created_at": created_time
            }
            db.save_comment(comment_record)
            
    db._write_json(db.issues_file, issues)
    print("Successfully seeded 15 issue records, upvotes, and comments.")
