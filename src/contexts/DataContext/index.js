import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo, // Importez useMemo depuis React (un Hook React qui vous permet de mettre en cache le résultat d'un calcul d'un rendu à l'autre)
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null); // add this line to declare the last state variable

  const getData = useCallback(async () => {
    try {
      const jsonData = await api.loadData(); // add await keyword to wait for the fetch to complete
      setData(jsonData); // update the data state variable with the fetched data
      if (Array.isArray(jsonData.events) && jsonData.events.length > 0) {
        setLast(jsonData.events[jsonData.events.length - 1]);
      } // update the last state variable with the last event in the events array
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (!data) {
      getData();
    }
  }, [data]);

  const contextValue = useMemo( 
    () => ({ data, error, last }), 
    [data, error, last]
  ); // update the contextValue to include the last state variable
 // Vérifie si data n'est pas null avant de fournir les données
 if (data === null) {
  return <div>Loading...</div>;
} // add this line to display a loading message while the data is being fetched

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;