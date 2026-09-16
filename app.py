from flask import Flask, render_template, jsonify

app = Flask(__name__)

CARE_DATA = {
    "patient": {
        "name": "Ama",
        "age": 74,
        "caregiver": "Rohan (Son)",
        "doctor": "Dr. Rajesh Sharma",
        "greeting": "Good Morning",
        "current_mood": "Relaxed",
        "daily_goal": {"completed": 4, "total": 4, "time": "5m 20s"}
    },
    "checklist": [
        {"id": 1, "title": "Morning Blood Pressure Tablet", "time": "8:30 AM", "type": "pill", "done": True},
        {"id": 2, "title": "Copper Cup Warm Water", "time": "9:00 AM", "type": "water", "done": True},
        {"id": 3, "title": "Garden Walk & Sunlight", "time": "9:45 AM", "type": "walk", "done": False},
        {"id": 4, "title": "Consultation with Dr. Sharma", "time": "11:30 AM", "type": "calendar", "done": False},
        {"id": 5, "title": "Afternoon Multivitamin", "time": "2:00 PM", "type": "pill", "done": False}
    ],
    "game_who": [
        {
            "id": 1,
            "name": "Priya",
            "emoji": "👧",
            "relation": "Daughter",
            "question": "Who is Priya to you?",
            "hint": "She visits every Sunday and brings fresh sweet jasmine flowers.",
            "options": ["Daughter", "Sister", "Friend"],
            "correct": "Daughter",
            "praise": "Wonderful! Priya is your beloved daughter."
        },
        {
            "id": 2,
            "name": "Ananya",
            "emoji": "👵",
            "relation": "Sister",
            "question": "Who is Ananya to you?",
            "hint": "She hand-knitted the warm orange woolen shawl for your birthday.",
            "options": ["Sister", "Doctor", "Neighbor"],
            "correct": "Sister",
            "praise": "Spot on! Ananya is your loving sister."
        },
        {
            "id": 3,
            "name": "Dr. Rajesh Sharma",
            "emoji": "🩺",
            "relation": "Family Doctor",
            "question": "Who is Dr. Sharma to you?",
            "hint": "He conducts your monthly health checkup and always praises your bright smile.",
            "options": ["Family Doctor", "Son", "Driver"],
            "correct": "Family Doctor",
            "praise": "Great job! Dr. Sharma is your gentle family doctor."
        },
        {
            "id": 4,
            "name": "Arjun",
            "emoji": "👦",
            "relation": "Grandson",
            "question": "Who is Arjun to you?",
            "hint": "He plays the acoustic guitar on holidays and loves your homemade sweets.",
            "options": ["Grandson", "Teacher", "Brother"],
            "correct": "Grandson",
            "praise": "Spot on! Arjun is your playful grandson."
        },
        {
            "id": 5,
            "name": "Meera",
            "emoji": "👩",
            "relation": "Caregiver Nurse",
            "question": "Who is Meera to you?",
            "hint": "She helps prepare your morning ginger tea and counts your daily steps.",
            "options": ["Nurse & Caregiver", "Dentist", "Shopkeeper"],
            "correct": "Nurse & Caregiver",
            "praise": "Exactly right! Meera is your trusted daily care companion."
        }
    ],
    "game_home": [
        {
            "id": 1,
            "quest": "Where did Grandpa usually sit by the window?",
            "room": "Living Room",
            "items": [
                {"name": "Grandpa's Armchair", "icon": "🪑", "correct": True, "feedback": "Spot on! Grandpa always sat in this comfortable armchair with his morning newspaper."},
                {"name": "Wooden Radio", "icon": "📻", "correct": False, "feedback": "That is the vintage wooden radio playing your favorite morning classical tunes."},
                {"name": "Veranda Tea Table", "icon": "☕", "correct": False, "feedback": "That is the tea table where afternoon snacks are set."},
                {"name": "Family Portrait Frame", "icon": "🖼️", "correct": False, "feedback": "That is the golden framed photograph of the entire family in Shimla."}
            ]
        },
        {
            "id": 2,
            "quest": "Where do we brew and keep the warm ginger tea?",
            "room": "Kitchen",
            "items": [
                {"name": "Ginger Tea Kettle", "icon": "🫖", "correct": True, "feedback": "Spot on! The warm copper kettle simmering on the stove."},
                {"name": "Fresh Fruit Basket", "icon": "🍎", "correct": False, "feedback": "That is the fruit basket filled with ripe Himachal apples."},
                {"name": "Clay Spice Jars", "icon": "🏺", "correct": False, "feedback": "Familiar traditional clay jars holding turmeric, cloves, and cardamom."},
                {"name": "Breakfast Dining Table", "icon": "🥣", "correct": False, "feedback": "That is the four-seater dining table with the checkered cloth."}
            ]
        },
        {
            "id": 3,
            "quest": "Where do you store the warm wool blankets for winter evenings?",
            "room": "Master Bedroom",
            "items": [
                {"name": "Teak Wood Wardrobe", "icon": "🚪", "correct": True, "feedback": "Spot on! The carved teak wooden closet smelling of fresh lavender sachets."},
                {"name": "Bedside Brass Lamp", "icon": "💡", "correct": False, "feedback": "That is the warm bedside reading lamp you use at dusk."},
                {"name": "Feather Pillow", "icon": "🛏️", "correct": False, "feedback": "That is the soft supportive pillow on the wooden bed."},
                {"name": "Sandalwood Box", "icon": "📦", "correct": False, "feedback": "That is the carved wooden box where you keep old postcards."}
            ]
        }
    ],
    "game_stories": [
        {
            "id": 1,
            "lead": "Priya visited home yesterday. She brought fresh",
            "blank_answer": "Flowers",
            "full_story": "Priya visited home yesterday. She brought fresh flowers for your vase.",
            "hint": "Sweet blooming petals that brighten up the living room table.",
            "options": ["Flowers", "Apple", "Cake"]
        },
        {
            "id": 2,
            "lead": "Every morning at 7:00 AM, you enjoy walking along the path filled with sweet",
            "blank_answer": "Jasmine",
            "full_story": "Every morning at 7:00 AM, you enjoy walking along the path filled with sweet Jasmine and marigolds.",
            "hint": "The white fragrant flowers blooming along the courtyard railing.",
            "options": ["Jasmine", "Croissants", "Phones"]
        }
    ]
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/data')
def get_care_data():
    return jsonify(CARE_DATA)

if __name__ == '__main__':
    app.run(debug=True, port=5000)