// The quotes were taken from Goodreads, available at: https://www.goodreads.com/quotes/tag/inspirational
const quote1 ={
    content : "Life is about accepting the challenges along the way, choosing to keep moving forward, and savoring  the journey.",
    author  : "Roy T. Bennett",
}

const quote2 ={
    content : "You only live once, but if you do it right, once is enough.",
    author  : "Mae West",
}

const quote3 ={
    content : "Good friends, good books, and a sleepy conscience: this is the ideal life.",
    author  : "Mark Twain",
}

const quote4 ={
    content : "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
    author  : "Bill Keane",
}

const quote5 ={
    content : "I have not failed. I've just found 10,000 ways that won't work.",
    author  : "Thomas A. Edison",
}

const quote6 ={
    content : "Do what you can, with what you have, where you are.",
    author  : "Theodore Roosevelt",
}

const quote7 ={
    content : "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author  : "Winston S. Churchill",
}

const quote8 ={
    content : "And, when you want something, all the universe conspires in helping you to achieve it.",
    author  : "Paulo Coelho",
}

const quote9 ={
    content : "The only way of discovering the limits of the possible is to venture a little way past them into the impossible.",
    author  : "Arthur C. Clarke",
}

const quote10 ={
    content : "Change the way you look at things and the things you look at change.",
    author  : "Wayne W. Dyer",
}

const quote11 ={
    content : "At the end of the day, let there be no excuses, no explanations, no regrets",
    author  : "Steve Maraboli",
}

const quote12 ={
    content : "Whatever the mind can conceive and believe, it can achieve.",
    author  : "Napoleon Hill",
}

const quote13 ={
    content : "Action may not always bring happiness, but there is no happiness without action. ",
    author  : "William James",
}

const quote14 ={
    content : "We are addicted to our thoughts. We cannot change anything if we cannot change our thinking.",
    author  : "Santosh Kalwar",
}

const quote15 ={
    content : "Life is about accepting the challenges along the way, choosing to keep moving forward, and savoring  the journey.",
    author  : "Roy T. Bennett",
}

// adding all objects into an array
const quoteList = [quote1, quote2, quote3, quote4, quote5, quote6, quote7, quote8, quote9, quote10, quote11, quote12, quote13, quote14, quote15];


// identify the variables GamepadButton, h2 and h5
const generate = document.querySelector('#generateForMe');
const saying = document.querySelector('#theContent');
const people = document.querySelector('#theAuthor');

// the function to execute the program which generates a random quote from the array
generate.addEventListener('click', () => {
    let num = Math.floor(Math.random()*15);
    let h2 = `"${quoteList[num].content}"`;
    let h5 = quoteList[num].author;
    saying.innerHTML= h2;
    people.innerHTML = h5;
});



