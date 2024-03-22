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

const updateVisibility = (id) => {

    document.body.classList.remove('form--active')

    fieldsets.forEach((fieldset, index) => {
        if (currentStep === index) {
            fieldset.classList.add('form__fieldset--active');
        } else {
            fieldset.classList.remove('form__fieldset--active');
        }
    }
    )

    if (id !== 'prev') {
        findBtn(id).disabled = true;
    }

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
}

const changeSlide = (e) => {
    setTimeout(() => {
        document.body.classList.add('form--active');
    }, 250)

    e.preventDefault();
    const id = e.currentTarget.dataset.id;

    if (id === 'next' && currentStep < fieldsets.length - 1) {
        currentStep += 1;
    } else if (id === 'prev' && currentStep > 0) {
        currentStep -= 1;
    }

    updateVisibility(id);

}

buttons.forEach((button) => {
        button.addEventListener('click', changeSlide);
    }
)

const validateInput = (inputList) => {
    let isValidInput = true;
    inputList.forEach((input) => {
        if (input.type === 'text' && input.required && !input.value) {
            isValidInput = false;
        } 
    })
    return isValidInput;
}

const hasChecked = (inputList) => {
    return Array.from(inputList).some((input) => {
        return input.checked;
    });
};

const validateForm = () => {
    let isNext = true;
    let isSubmit = true;

    const containerElements = fieldsets[currentStep]
        .querySelectorAll('.form__radio-wrapper, .form__input-wrapper');

    containerElements.forEach((container) => {

       const inputList = container.querySelectorAll('input');

       const isValidInput = validateInput(inputList);

        if (isValidInput) {
            isSubmit = false;
        }

        const isValidChecked = hasChecked(inputList);
        
        const hasTextField = container.querySelectorAll('input[type=text]')[0];
        if (!isValidChecked) {
            if (hasTextField && isValidInput) {
                isNext = true;
                return
            }
            isNext = false;
            // return;
        }
    })

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
    e.preventDefault()

});
