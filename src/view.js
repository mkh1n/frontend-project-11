
const render = (state, elements) => {
    const {form, input, submit} = elements;
    if(state.form.isValid){
        input.classList.remove('is-invalid')
        input.value = '';
        input.focus();
    } else {
        input.classList.add('is-invalid')
    }
}
export { render }