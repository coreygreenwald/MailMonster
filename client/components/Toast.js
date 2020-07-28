import React from 'react';
import {connect} from 'react-redux';
import {setMessageAndState} from '../store';
import toast from '../store/toast';

const Toast = ({message, toastState, clearToast}) => {
  return (
    <div className="toast">
      {message ? (
        <div className={'alert ' + toastState}>
          <span className="closebtn" onClick={clearToast}>
            &times;
          </span>
          {message}
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  message: state.toast.message,
  toastState: state.toast.state,
});

const mapDispatchToProps = (dispatch) => ({
  clearToast() {
    dispatch(setMessageAndState('', null));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Toast);
