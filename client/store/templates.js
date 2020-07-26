import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_TEMPLATES = 'GET_TEMPLATES';
const SET_ACTIVE_TEMPLATE = 'SET_ACTIVE_TEMPLATE'
// const REMOVE_USER = 'REMOVE_USER';

const defaultTemplates = {
  activeTemplate: {},
  items: []
};

const getTemplates = (templates) => ({type: GET_TEMPLATES, templates});
const setActiveTemplate = (template) => ({type: SET_ACTIVE_TEMPLATE, template});

export const fetchTemplates = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/templates');
    dispatch(getTemplates(res.data || []));
  } catch (err) {
    console.error(err);
  }
};

export const updateTemplate = (templateData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/templates', templateData);
    dispatch(setActiveTemplate(res.data || templateData || {}));
  } catch (err) {
    console.error(err);
  }
};

export default function (state = defaultTemplates, action) {
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
