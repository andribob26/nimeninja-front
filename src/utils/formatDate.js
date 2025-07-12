const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }); // Hasil: 7 Juli 2025
};

export default formatDate;
