function RedirectToUser() {
  const handleClick = () => {
    window.location.replace("/user.html"); // opens user.html from public folder
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Map Page</h2>
      <button onClick={handleClick}>Open User HTML</button>
    </div>
  );
}

export default RedirectToUser;
