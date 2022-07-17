import { useState } from "react";
import { Button, TextField } from "../elements";
import { AddPhoto } from "./";

interface selectedPictureType {
  item: string;
  type: string;
}

export const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPicture, setSelectedPicture] =
    useState<selectedPictureType | null>(null);

  const handleSubmit = () => {
    console.log("create project");
    console.log("name", name);
    console.log("description", description);
    console.log("selectedPicture", selectedPicture);
  };

  return (
    <div className="border p-4">
      <h1>Create Project</h1>
      <TextField label="name" onChange={(e) => setName(e.target.value)} />
      <TextField
        label="description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <AddPhoto onSelect={(photo) => setSelectedPicture(photo)} />

      <Button onClick={() => handleSubmit()}>Create Project</Button>
    </div>
  );
};
