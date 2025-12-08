const getCurrentGreating = (): string => {
    const currentHour = new Date().getHours();
    let greeting = "";
    
    if (currentHour >= 6 && currentHour < 12) {
        greeting = "Bom dia ✋";
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Boa tarde 🌇";
    } else {
        greeting = "Boa noite ☁";
    }

    return greeting
}


export {getCurrentGreating}