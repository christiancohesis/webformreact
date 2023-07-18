import React from 'react';

const Details = ({ formData }) => {
  const { name, email, phone, requestType, requestDesc, serviceArea, title, address, photos,user_id } = formData;

  return (
    <div id='details'>
      <h1>Form Submission Details</h1>
      <h2>Requester Information:</h2>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>

      <h2>Location</h2>
      <p>Address: {address}</p>

      <h2>Request Details</h2>
      <p>Title: {title}</p>
      <p>Service Area: {serviceArea}</p>
      <p>user ID: {user_id}</p>
      <p>Request Type: {requestType}</p>
      <p>Request Description: {requestDesc}</p>

      <h2>Attached Photos</h2>
      <div>
        {photos.map((photo, index) => (
          <img key={index} src={URL.createObjectURL(photo)} alt={`Pic ${index}`} width="200" height="200" />
        ))}
      </div>
    </div>
  );
};

export default Details;