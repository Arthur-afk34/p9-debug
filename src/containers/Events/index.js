import React, { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = (
    (!type ? data?.events : data?.events.filter(event => event.type === type)) || [] // filter by page number and type if exists
  ).filter((event, index) => {
    if ( // Vérifiez si l'index est compris entre la page actuelle et la page suivante multippliée par le nombre d'éléments par page et que la page actuelle est supérieure ou égale à 1
      (currentPage - 1) * PER_PAGE <= index &&
      PER_PAGE * currentPage > index
    ) {
      return true;
    }
    return false;
  });

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType === type ? null : evtType);
  };

  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(new Set(data?.events.map((event) => event.type)))} // get unique types from events and map them to an array of objects with the value and label properties set to the type value
            onChange={(value) => changeType(value)} // call changeType function with the selected value as argument when the selection changes and update the type state with the selected value or null if the selected value is the same as the current type state value to reset the filter and show all events again
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;