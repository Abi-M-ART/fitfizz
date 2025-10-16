// --- Global Variables to Store Results ---
let userBMI = null;
let userCategory = null;

// --- CORE LOGIC FUNCTIONS ---

function calculateBMI(weight_kg, height_m) {
    /**
     * Calculates BMI: BMI = weight (kg) / height (m)^2
     */
    return weight_kg / (height_m * height_m);
}

function getCategory(bmi) {
    /**
     * Classifies BMI based on WHO standards.
     */
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi <= 24.9) return "Normal Weight";
    if (bmi >= 25.0 && bmi <= 29.9) return "Overweight";
    return "Obesity";
}

function getMealSuggestions(category) {
    /**
     * Provides rule-based meal suggestions based on BMI category.
     */
    if (category === "Underweight") {
        return {
            goal: "Weight Gain (Calorie Dense)",
            meals: "Breakfast: High-calorie smoothie with nuts/oats. | Lunch: Pasta with chicken/fish. | Dinner: Red meat or lentil stew."
        };
    } else if (category === "Overweight" || category === "Obesity") {
        return {
            goal: "Weight Loss (Calorie Deficit)",
            meals: "Breakfast: Egg whites and vegetables. | Lunch: Large leafy green salad with lean protein. | Dinner: Baked fish and steamed broccoli."
        };
    } else { // Normal Weight
        return {
            goal: "Maintenance (Balanced Diet)",
            meals: "Breakfast: Oatmeal and fruit. | Lunch: Whole-grain sandwich and side salad. | Dinner: Lean protein stir-fry with brown rice."
        };
    }
}

// --- APPLICATION FLOW (Called by the HTML button) ---

function calculateAndAnalyze() {
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    
    const weight = parseFloat(weightInput.value);
    const heightCm = parseFloat(heightInput.value);
    const heightM = heightCm / 100; // Convert cm to meters

    const resultDiv = document.getElementById('bmiResult');
    const suggestionsDiv = document.getElementById('mealSuggestions');
    const chatInput = document.getElementById('chatInput');
    const chatOutput = document.getElementById('chatOutput');

    // 1. Input Validation
    if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<strong>Error:</strong> Please enter valid weight and height values.';
        suggestionsDiv.style.display = 'none';
        chatInput.disabled = true;
        chatOutput.textContent = 'Please enter valid data to activate the analyzer.';
        return;
    }

    // 2. Calculation and Classification
    userBMI = calculateBMI(weight, heightM);
    userCategory = getCategory(userBMI);
    const suggestions = getMealSuggestions(userCategory);

    // 3. Display BMI Result
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <strong>BMI:</strong> ${userBMI.toFixed(2)}<br>
        <strong>Category:</strong> ${userCategory}<br>
        <strong>Interpretation:</strong> This is a key metric used to assess overall health.
    `;

    // 4. Display Meal Suggestions
    suggestionsDiv.style.display = 'block';
    suggestionsDiv.innerHTML = `
        <h4>Your Meal Plan | Goal: ${suggestions.goal}</h4>
        <p>Based on your **${userCategory}** BMI, here is a suggested macro-level plan:</p>
        <p><strong>Meals:</strong> ${suggestions.meals}</p>
    `;
    
    // 5. Enable Chatbot
    chatInput.disabled = false;
    chatOutput.innerHTML = `AI Assistant: Hello! Based on your **${userCategory}** status, how can I help with your meal plan?`;
    // Add event listener to handle 'Enter' key press in the chat input
    chatInput.removeEventListener('keypress', handleChatKeyPress); // Remove old listener first
    chatInput.addEventListener('keypress', handleChatKeyPress);
}

// --- SIMULATED CHATBOT INTERACTION ---

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission if in a form
        handleChat();
    }
}

function handleChat() {
    const input = document.getElementById('chatInput');
    const output = document.getElementById('chatOutput');
    const userQuery = input.value.trim();

    if (!userQuery || userCategory === null) return;

    const lowerQuery = userQuery.toLowerCase();
    let response = `AI Assistant: Your question, "${userQuery}", requires complex AI integration. Try asking about "snack" or "water"!`;

    // Rule-based responses for common keywords
    if (lowerQuery.includes('snack')) {
        response = 'AI Assistant: A good snack is cottage cheese, nuts, or a small piece of fruit!';
    } else if (lowerQuery.includes('water') || lowerQuery.includes('hydration')) {
        response = 'AI Assistant: Remember to drink at least 8 glasses of water a day!';
    } else if (lowerQuery.includes('rice') && (userCategory === "Overweight" || userCategory === "Obesity")) {
        response = 'AI Assistant: Focus on small portions of **brown rice** instead of white, as part of a calorie-controlled meal.';
    }

    // Display user and AI response
    output.innerHTML = `
        <strong>You:</strong> ${userQuery}<br>
        ${response}
    `;

    // Clear input
    input.value = '';
}