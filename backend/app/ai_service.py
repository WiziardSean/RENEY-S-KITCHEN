import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

# Initialize the OpenAI client
api_key = os.environ.get("OPENAI_API_KEY", "")
client = OpenAI(api_key=api_key) if api_key else None

def generate_custom_menu(guests: int, budget: float, occasion: str, dietary_restrictions: str) -> dict:
    """
    Generates a custom 3-course private chef menu with wine pairings using gpt-4o-mini.
    Includes a demo fallback structure if the OpenAI API Key is not set in the environment.
    """
    if not api_key or not client:
        # Fallback response for demo purposes in case OpenAI key is missing
        person_budget = budget / guests if guests > 0 else budget
        return {
            "occasion": occasion,
            "appetizer": {
                "name": "Heirloom Tomato & Burrata (Demo Fallback)",
                "description": "Artisanal burrata with handpicked heirloom cherry tomatoes, fresh basil oil, and aged balsamic glaze.",
                "wine_pairing": "Chablis Premier Cru 2021",
                "wine_pairing_notes": "The crisp mineral notes of this Chardonnay slice beautifully through the rich creaminess of the burrata."
            },
            "main": {
                "name": "Pan-Seared Duck Breast (Demo Fallback)",
                "description": "Seared Moulard duck breast served with a wild blackberry reduction and parsnip purée.",
                "wine_pairing": "Pinot Noir, Willamette Valley 2019",
                "wine_pairing_notes": "The bright acidity and red berry notes of the Pinot Noir complement the savory richness of the duck."
            },
            "dessert": {
                "name": "Molten Chocolate Lava Cake (Demo Fallback)",
                "description": "Warm, rich dark chocolate cake with a molten center, served with Madagascan vanilla bean gelato.",
                "wine_pairing": "Tawny Port 10 Years Old",
                "wine_pairing_notes": "The sweet, dried fruit and nutty undertones of the Port pair beautifully with the dark chocolate."
            },
            "budget_analysis": f"The total menu budget of ${budget} allows for approximately ${person_budget:.2f} per person (for {guests} guests), which fits our signature premium package ingredients."
        }

    prompt = f"""
    You are an elite private chef and master sommelier. Design an exquisite 3-course private chef menu for a luxury event:
    - Guests: {guests}
    - Total Budget: ${budget} (roughly ${budget/guests:.2f} per guest)
    - Occasion: {occasion}
    - Dietary Restrictions: {dietary_restrictions if dietary_restrictions else 'None'}

    For each of the three courses (Appetizer, Main, Dessert), provide:
    - The dish name
    - The dish description (detailed, gourmet and mouthwatering)
    - A specific, premium wine pairing
    - Wine pairing notes explaining why they match.

    Ensure that the menu represents high-end fine dining and realistically fits the budget parameters.
    
    Respond STRICTLY in JSON format with the following structure:
    {{
        "occasion": "{occasion}",
        "appetizer": {{
            "name": "Appetizer Dish Name",
            "description": "Appetizer Detailed Description",
            "wine_pairing": "Wine Pairing Name",
            "wine_pairing_notes": "Notes on why it pairs well"
        }},
        "main": {{
            "name": "Main Dish Name",
            "description": "Main Detailed Description",
            "wine_pairing": "Wine Pairing Name",
            "wine_pairing_notes": "Notes on why it pairs well"
        }},
        "dessert": {{
            "name": "Dessert Dish Name",
            "description": "Dessert Detailed Description",
            "wine_pairing": "Wine Pairing Name",
            "wine_pairing_notes": "Notes on why it pairs well"
        }},
        "budget_analysis": "Brief description of how the ingredients and wine pairings align with the overall budget of ${budget}."
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a world-class private chef and sommelier who curates fine dining menus in strict JSON format."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )

    return json.loads(response.choices[0].message.content)
