export const getSundayDate = (year, monthName, sundayNumber) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = months.indexOf(monthName);
    if (monthIndex === -1) return null;

    const firstDayOfMonth = new Date(year, monthIndex, 1);
    let firstSundayDate = 1;
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday

    if (dayOfWeek !== 0) {
        firstSundayDate = 1 + (7 - dayOfWeek);
    }

    const targetDate = firstSundayDate + (sundayNumber - 1) * 7;
    const resultDate = new Date(year, monthIndex, targetDate);

    // Check if the calculated date is still within the same month
    if (resultDate.getMonth() !== monthIndex) return null;

    return resultDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const countSundaysInMonth = (year, monthName) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = months.indexOf(monthName);
    if (monthIndex === -1) return 0;

    const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();
    let count = 0;

    for (let day = 1; day <= lastDayOfMonth; day++) {
        const date = new Date(year, monthIndex, day);
        if (date.getDay() === 0) { // 0 is Sunday
            count++;
        }
    }

    return count;
};

export const formatSundayNumber = (number) => {
    const suffixes = {
        1: '1st',
        2: '2nd',
        3: '3rd',
        4: '4th',
        5: '5th'
    };
    return `${suffixes[number]} Sunday`;
};
