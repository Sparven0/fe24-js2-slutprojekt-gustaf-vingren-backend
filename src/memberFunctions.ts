
// I denna filen finns funktioner för att läsa och skriva till json filen som innehåller medlemmarna.
// Den läser filen samt skriver till den.


import fs from 'fs/promises';
const path = './src/membersDB.json';


// en typ för medlemmar

type Member = {
    username: string;
    email: string;
    role: string;
}



// läser json filen

export async function readMembers(): Promise<any> {
  try {
    const rawData = await fs.readFile(path, 'utf-8');
    if (!rawData) {
      return { members: [] }; 
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading the file:', error);
    throw error;
  }
}



// lägger till medlemmar

export async function writeMember(member: Member): Promise<any> {
  try {
    const data = await readMembers();
    const members = data.members || [];
    members.push(member);
    await fs.writeFile(path, JSON.stringify({ members }, null, 2));

    console.log('Member added successfully');
  } catch (error) {
    console.error('Error writing member data:', error);
    throw error;
  }
}
