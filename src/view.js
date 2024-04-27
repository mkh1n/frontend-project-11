import onChange from "on-change";
import getRss from './rss.js';

export default (state, elements, i18nI) => {
    const watchedState = onChange(state, (path, value) => {
        switch (path) {
            case 'form.error':
                if (watchedState.form.error) {
                    elements.input.classList.add('is-invalid');
                    elements.feedback.textContent = state.form.error;
                    elements.feedback.classList.remove('text-success');
                    elements.feedback.classList.add('text-danger');
                } else {
                    elements.input.value = '';
                    elements.input.focus();
                    elements.input.classList.remove('is-invalid');
                    elements.feedback.textContent = i18nI.t('successfullyLoaded');
                    elements.feedback.classList.add('text-success');
                    elements.feedback.classList.remove('text-danger');
                }
                break;
            default:
                break;
        }
    })
        return watchedState;
}
