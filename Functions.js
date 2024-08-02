export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const last = function(l) {
    return l[l.length - 1];
};

export const bound = function(min, max, value) {
    return Math.max(min, Math.min(max, value));
};

export const lerp = function(min, max, rate) {
    return min + (max - min) * rate;
};

export const randomFloat = function(min, max) {
    return lerp(min, max, Math.random());
};

export const randomInt = function(min, max) {
    return Math.round(randomFloat(min, max));
};

export const randomSelect = function(l) {
    if(l.length === 0) return null;
    return l[randomInt(0, l.length - 1)];
};

export const randomColor = function(min, max) {
    min = min || 0;
    max = max || 255;
    const r = randomInt(min, max).toString(16).padStart(2, "0");
    const g = randomInt(min, max).toString(16).padStart(2, "0");
    const b = randomInt(min, max).toString(16).padStart(2, "0");
    return "#" + r + g + b;
};

export const randomBool = function(prob) {
    prob = prob || 0.5;
    return Math.random() < prob;
};


export const dateToStringTime = function(date) {
    date = date || new Date();
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
};

export const dateToStringDate = function(date) {
    date = date || new Date();
    return `${(date.getFullYear()%100).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
};

export const dateToString = function(date) {
    date = date || new Date();
    return dateToStringDate(date) + " " + dateToStringTime(date);
};

export const dateToStringDetail = function(date) {
    date = date || new Date();
    return dateToString(date) + 
    `:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
};
