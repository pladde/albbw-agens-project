const API_URL = 'http://localhost:3000/api';

export const fetchData = async () => 
{
    try
    {
        const response = await fetch(`${API_URL}/fahrrad`);
        if(!response.ok)
        {
            throw new Error('Netzwerk-Fehler!');
        }
        return await response.json();

    } catch (error)
    {
        console.error("Fehler beim Abrufen: " , error);
        return null;
    }
};