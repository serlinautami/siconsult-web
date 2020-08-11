import { React, PropTypes, classnames } from '../../../libraries';
import './styles.css';

const Loading = ({ show }) => {
  const wrapperClass = classnames('loading', {
    show
  });

  return (
    <div className={wrapperClass}>
      <div className="loading-content">
        <span className="loading-text">Loading...</span>
      </div>
    </div>
  );
};
Loading.propTypes = {
  show: PropTypes.bool
};

Loading.defaultProps = {
  show: false
};

export default React.memo(Loading);
