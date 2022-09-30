import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const SnackBar = ({ boolean, handleClose, severity, message }) => {
  return (
    <Snackbar open={boolean} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} variant="filled" severity={severity}>
        {`${message}`}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
