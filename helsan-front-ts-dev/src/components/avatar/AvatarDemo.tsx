import Avatar from ".";
import image from "@/assets/images/doctor-avatar.png";
const AvatarDemo = () => {
  return (
    <>
      <Avatar
        name="Farnood Mollaie"
        size="lg"
        editable
        onChange={(file) => {
          // send `file` to backend / upload service here
          console.log("Selected avatar file:", file);
        }}
      />
      <Avatar src={image} name="Farnood Mollaie" size="md" status="away" />
    </>
  );
};

export default AvatarDemo;
