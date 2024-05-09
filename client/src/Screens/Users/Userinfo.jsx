import React from 'react';
import Info from '../../assets/Video/Info.mp4'

const Userinfo = () => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
      <div className="mb-6">
        <h2 className="text-gray-800 text-lg font-semibold mb-2">Instructions in English</h2>
        <ul className="list-disc list-inside text-gray-700 text-base">
          <li>Register your account</li>
          <li>Login and navigate to the booking arena</li>
          <li>Select the slot you wish to reserve</li>
          <li>Send a message via the WhatsApp button</li>
          <li>Return to the website</li>
          <li>Select the sport you want to reserve</li>
          <li>Press the 'Reserve' button</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-gray-800 text-lg font-semibold mb-2">ہدایات اردو میں</h2>
        <ul className="list-disc list-inside text-gray-700 text-base">
          <li>اپنا اکاؤنٹ رجسٹر کریں</li>
          <li>لاگ ان کریں اور بکنگ ایرینا میں جائیں</li>
          <li>جس سلاٹ کو آپ ریزرو کرنا چاہتے ہیں اسے منتخب کریں</li>
          <li>واٹس ایپ بٹن کے ذریعے پیغام بھیجیں</li>
          <li>ویب سائٹ پر واپس آئیں</li>
          <li>جس کھیل کو آپ بک کرنا چاہتے ہیں اسے منتخب کریں</li>
          <li>'ریزرو' بٹن دبائیں</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-gray-800 text-lg font-semibold mb-2">Video Tutorial</h2>
        <video controls className="w-full">
          <source src={Info} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Userinfo;
