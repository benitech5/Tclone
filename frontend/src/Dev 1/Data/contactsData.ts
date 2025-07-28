import { ImageSourcePropType } from "react-native";

export interface Contact {
  id: string;
  name: string;
  status: string;
  avatar: ImageSourcePropType;
}

export const contactsData: Contact[] = [
  {
    id: "1",
    name: "Alice Smith",
    status: "0249876543",
    avatar: require("../../../assets/avatars/Jujutsu Kaisen.jpeg"),
  },
  {
    id: "2",
    name: "Bob Johnson",
    status: "0551234567",
    avatar: require("../../../assets/avatars/setUpGaming.jpeg"),
  },
  {
    id: "3",
    name: "Calise Brown",
    status: "0201112233",
    avatar: require("../../../assets/avatars/everything/randommer.jpeg"),
  },
  {
    id: "4",
    name: "Diana Johnson",
    status: "0551234567",
    avatar: require("../../../assets/avatars/everything/garnacho.jpeg"),
  },
  {
    id: "5",
    name: "Ethan Davis",
    status: "0551234567",
    avatar: require("../../../assets/avatars/everything/wow.jpeg"),
  },
  {
    id: "6",
    name: "Fiona Williams",
    status: "0551234567",
    avatar: require("../../../assets/avatars/everything/OnePiece.jpeg"),
  },
  {
    id: "7",
    name: "Gideon Smith",
    status: "0551234567",
    avatar: require("../../../assets/avatars/everything/purpleroom.jpeg"),
  },
  {
    id: "8",
    name: "Hannah Brown",
    status: "0551234567",
    avatar: require("../../../assets/avatars/everything/roro.jpeg"),
  },
  {
    id: "9",
    name: "Ivy Green",
    status: "0551234567",
    avatar: require("../../../assets/avatars/everything/tennisballs.jpeg"),
  },
  {
    id: "10",
    name: "Jack Johnson",
    status: "0551234567",
    avatar: require("../../../assets/avatars/everything/hello.jpeg"),
  },
  {
    id: "11",
    name: "Kyle Davis",
    status: "0551234567",
    avatar: require("../../../assets/avatars/everything/lightning.jpeg"),
  },
  {
    id: "12",
    name: "Liam Wilson",
    status: "0551234567",
    avatar: require("../../../assets/avatars/everything/bluffy.jpeg"),
  },
  {
    id: "13",
    name: "Mia Martinez",
    status: "0551234567",
    avatar: require("../../../assets/avatars/everything/acer.jpeg"),
  },
  // Add more contacts as needed, e.g.:
  // {
  //   id: "3",
  //   name: "Charlie Example",
  //   status: "offline",
  //   avatar: require("../../assets/avatars/user3.png"),
  // },
];
