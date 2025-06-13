const Loading = () => {
  return (
     <div
      className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgb(73 73 73 / 74%)',
        zIndex: 1050,
      }}
    >
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Đang tải...</span>
      </div>
    </div>
  );
};

export default Loading;
