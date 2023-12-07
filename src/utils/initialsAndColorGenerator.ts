import { User } from "../types/user";

export type InitialsAndColors = {
    [userId: string]: {
        label: string
        color: string
    }
}

export const initialsAndColorGenerator = (friends: User[]): InitialsAndColors => {
    return friends.reduce((acc, user) => {
        const newUser = {
            color: stringToColour(user.name),
            label: nameToInitials(user.name, acc)
        };
        return {...acc, [user.id]: newUser};
    }, {} as InitialsAndColors);
};

const labelTaken = (label: string, mappedFriends: InitialsAndColors): boolean =>
    Object.values(mappedFriends).map(user => user.label).includes(label);

const nameToInitials = (unFormattedName: string, mappedFriends: InitialsAndColors): string => {
    const name = unFormattedName.toUpperCase();
    let initials = name[0];
    if (!labelTaken(initials, mappedFriends)) return initials;
    initials = name[0].concat(name[1]);
    if (!labelTaken(initials, mappedFriends)) return initials;

    return name[0].concat(name[name.length-1]);
};

const stringToColour = (str: string) => {
  let hash = 0;
  str.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, '0');
  }
  return colour;
};