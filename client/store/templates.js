import axios from 'axios';
import {setMessageAndState} from './toast';

/**
 * ACTION TYPES
 */
const GET_TEMPLATES = 'GET_TEMPLATES';
const SET_ACTIVE_TEMPLATE = 'SET_ACTIVE_TEMPLATE'

const defaultTemplate = {
  activeTemplate: -1,
  items: []
};

const getTemplates = (templates) => ({type: GET_TEMPLATES, templates});
export const setActiveTemplate = (template) => ({type: SET_ACTIVE_TEMPLATE, template});


const templateFetchHelper = async (dispatch) => {
  const res = await axios.get('/api/templates');
  dispatch(getTemplates(res.data || []));
  return res.data;
};

export const fetchTemplates = () => templateFetchHelper

export const updateTemplate = (templateData) => async (dispatch, getState) => {
  try {
    const res = await axios.post('/api/templates', templateData);
    const id = res.data.id;
    const updatedTemplates = await templateFetchHelper(dispatch);
    const existingItemLocation = updatedTemplates.reduce((prev, currItem, currIdx) => currItem.id === id ? currIdx : prev, -1);
    dispatch(setActiveTemplate(existingItemLocation));
  } catch (err) {
    setMessageAndState(`Something went wrong: ${err}`, 'error');
  }
};

export default function (state = defaultTemplate, action) {
  const newState = {...state};
  switch (action.type) {
    case GET_TEMPLATES:
      newState.items = action.templates;
      return newState;
    case SET_ACTIVE_TEMPLATE:
      newState.activeTemplate = action.template;
      return newState;
    default:
      return state;
  }
}
