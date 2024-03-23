const form = document.querySelector('.form');
const fieldsets = document.querySelectorAll('.form__fieldset');
const buttons = document.querySelectorAll('.form__btn');
const inputs = document.querySelectorAll('.form__input, .radio__input');

let currentStep = 0;

const findBtn = (id) => {
    let button = null;
    buttons.forEach((item)=> {
        if (item.getAttribute('data-id') === id) {
            button = item;
        }
    })
    return button;
};


const setButtonsDisabled = () => {

    const isValid = validateForm();

    findBtn('next').disabled = !isValid.isNext;
    findBtn('submit').disabled = isValid.isSubmit;

    findBtn('next').classList.add('form__btn-active');
    findBtn('prev').classList.add('form__btn-active');

    if (currentStep === fieldsets.length - 1) {
        findBtn('submit').classList.add('form__btn-active');
        findBtn('next').classList.remove('form__btn-active');
    } else {
        findBtn('submit').classList.remove('form__btn-active');
    }

    if (currentStep === 0) {
        findBtn('prev').classList.remove('form__btn-active');
    }
};

const updateVisibility = (id) => {
    document.body.classList.remove('form--active');
        fieldsets.forEach((fieldset, index) => {
            if (currentStep === index) {
                fieldset.classList.add('form__fieldset--active');
            } else {
                fieldset.classList.remove('form__fieldset--active');
            }
        }
    );
    if (id !== 'prev') {
        findBtn(id).disabled = true;
    }
    setButtonsDisabled(id);
};

const changeSlide = (e) => {
    setTimeout(() => {
        document.body.classList.add('form--active');
    }, 250);

    const id = e.currentTarget.dataset.id;

    if (id === 'next' && currentStep < fieldsets.length - 1) {
        currentStep += 1;
    } else if (id === 'prev' && currentStep > 0) {
        currentStep -= 1;
    }

    updateVisibility(id);

};

buttons.forEach((button) => {
        button.addEventListener('click', changeSlide);
    }
);

const validateInputText = (inputList) => {
    return inputList.every((input) => {
        if (input.type === 'text' && input.required && !input.value) {
           return false;
        } 
        return true;
    });
};

const validateInputChecked = (inputList) => {
    return inputList.some((input) => {
        return input.checked;
    });
};

const validateForm = () => {
    let isNext = true;
    let isSubmit = true;

    const containerElements = fieldsets[currentStep]
        .querySelectorAll('.form__radio-wrapper, .form__input-wrapper');

    //joining 2 arrays
    const inputList = Array.from(containerElements).map((el)=> {
       return el.querySelectorAll('input');
    });

    //iteration by containers
    for (let input of inputList) {     

        let inputItem = Array.from(input);

        //checking valid input-text
        const isValidInput = validateInputText(inputItem);

        if (isValidInput) {
            isSubmit = false;
        }

        //checking valid checkbox or radio
        const isValidChecked = validateInputChecked(inputItem);

        //have input-text with radio?
        const hasTextField = inputItem.every((el) => {
                el.type === 'text' && el.type === 'radio' 
                || 
                el.type === 'text' && el.type === 'checkbox'
            }
        );

        if (!isValidChecked) {
            //has input-text with radio and valid
            if (hasTextField && isValidInput) {
                isNext = true;
                return;
            }
            isNext = false;
        }
    };
    return {
        isNext,
        isSubmit
    };
};

const onInput = () => {
    const isValid = validateForm();
    findBtn('next').disabled = !isValid.isNext;
    findBtn('submit').disabled = isValid.isSubmit;
}

inputs.forEach((input) => {
        input.addEventListener('input', onInput);
    }
)

form.addEventListener('submit', (e)=> {
    e.preventDefault();
    setButtonsDisabled();
});
