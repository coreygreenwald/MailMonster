import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_TEMPLATES = 'GET_TEMPLATES';
const SET_ACTIVE_TEMPLATE = 'SET_ACTIVE_TEMPLATE'
const SET_NEW_TEMPLATE = 'SET_NEW_TEMPLATE'

const defaultTemplates = {
  activeTemplate: null,
  items: []
};

const getTemplates = (templates) => ({type: GET_TEMPLATES, templates});
const setNewTemplate = (template) => ({type: SET_NEW_TEMPLATE, template})
export const setActiveTemplate = (template) => ({type: SET_ACTIVE_TEMPLATE, template});

export const fetchTemplates = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/templates');
    dispatch(getTemplates(res.data || []));
  } catch (err) {
    console.error(err);
  }
};

export const updateTemplate = (templateData) => async (dispatch, getState) => {
  try {
    const res = await axios.post('/api/templates', templateData);
    const id = res.data.id;
    // const refetchTemplates = await fetchTemplates();
    const {templates} = getState();
    const {items} = templates;
    let existingItemLocation = items.reduce((prev, currItem, currIdx) => currItem.id === id ? currIdx : prev, -1);
    if(existingItemLocation === -1){
      dispatch(setNewTemplate(res.data));
      dispatch(setActiveTemplate(items.length));
    } else {
      dispatch(setActiveTemplate(existingItemLocation));
    }
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
    case SET_NEW_TEMPLATE:
      newState.items = [...newState.items, action.template]
      return newState;
    case SET_ACTIVE_TEMPLATE:
      newState.activeTemplate = action.template;
      return newState;
    default:
      return state;
  }
}
