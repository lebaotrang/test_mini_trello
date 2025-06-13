const Avatar = ({ email }) => {
  // Lấy phần trước dấu @ và lấy 2 ký tự đầu tiên, viết hoa
  const getInitials = (email) => {
    if (!email) return 'A';
    const namePart = email.split('@')[0];
    return namePart.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className="rounded-circle bg-danger text-white d-flex justify-content-center align-items-center me-2"
      style={{ width: 32, height: 30, fontSize: 12 }}
    >
      {getInitials(email)}
    </div>
  );
};

export default Avatar;
