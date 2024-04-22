import { render } from "./view.js";
import * as yup from "yup";
import onChange from 'on-change';

export default () =>{
    const elements = {
        form: document.querySelector('form'),
        input: document.querySelector('input'),
        submit: document.querySelector('button[type="submit"]')
    }
    const initialState = {
        url: '',
        feedList: [],
        form: {
            isValid: false,
            errors: []
        }
    }
    const watchedState = onChange(initialState, (path, value) => {
        initialState.url = value
    })
    const validateUrl = (link, collection) => {
        const schemaStr = yup.string().required().url().trim();
        const schemaMix = yup.mixed().notOneOf(collection);
        return schemaStr.validate(link)
          .then((url) => schemaMix.validate(url));
      };
    
    elements.form.addEventListener('submit', (e)=> {
        e.preventDefault();
        const url = new FormData(elements.form).get('url');
        watchedState.url = url;
        const links = watchedState.feedList;
        validateUrl(url, links).then(()=>{
            watchedState.form.isValid = true;
            watchedState.feedList.push(url);
            console.log(initialState);
            render(watchedState, elements);
        }).catch((e)=>{
            watchedState.form.isValid = false;
            console.log(e);
            render(watchedState, elements);
        })
    })
}
