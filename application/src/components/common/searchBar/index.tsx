import { useEffect, useRef, useState } from "react";
import { searchIcon } from "../../../assets/icons";
import "./style.css";
import { Input, Pagination } from "antd";
import { useDebounce } from "use-debounce";
import { getFilterInfo, resetFilterState, setFilterState } from "../../../redux/features/filter/filterSlice";
import { useSelector, useDispatch } from "react-redux";
import {useLocation} from 'react-router';


const UISearchBar = (props: any) => {
  const {
    search,
    setSearch,
    pagination,
    setPagination,
    placeholder,
    selectedTab,
  } = props;
  const [showInput, setShowInput] = useState(false);
  const stateSearch = useSelector(getFilterInfo);
  const currentURL = window.location.href;
  console.log('search state value', stateSearch?.value);
  
  const [text, setText] = useState(stateSearch?.value ?? "");
  const [debouncedText] = useDebounce(text, 1000);
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
 



  const handleClick = () => {
    setShowInput(true);
  };

  useEffect(() => {

    // if same url and value found in state
    if((stateSearch?.url == currentURL || stateSearch?.tab == selectedTab) && stateSearch?.value){
      setShowInput(true);
   }

    // reset filter when tab or url changes
    if(stateSearch?.url !== currentURL || stateSearch?.tab != selectedTab){
    setText("");
    setShowInput(false);
    dispatch(resetFilterState());
    }
  }, [selectedTab, currentURL]);

  // implement debouncing to prevent unnecessary api calls
  useEffect(() => {
    setSearch(debouncedText);
  }, [debouncedText]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [showInput]);

  return (
    <div className="seavaluerch-renderer">
      {showInput ? (
        <Input
          ref={inputRef}
          className="searchInput"
          placeholder={placeholder}
          onBlur={(e) => {
            if (!e.target.value) {
              setShowInput(false);
            }
          }}
          value={text}
          allowClear
          onChange={(e: any) => {
            setPagination({ ...pagination, current: 1 });
            setText(e.target.value);
            dispatch(setFilterState({value:e.target.value, url: currentURL, tab: selectedTab}));
          }}
          prefix={<img alt="searchBar" src={searchIcon} />}
        />
      ) : (
        <img alt="searchBar" src={searchIcon} onClick={handleClick} />
      )}
    </div>
  );
};

const UISearchInput = ({
  search,
  setSearch,
  placeholder,
  pagination,
  setPagination,
}: any) => {
  const inputRef: any = useRef();
  const [text, setText] = useState(search);
  const [debouncedText] = useDebounce(text, 1000);

  useEffect(() => {
    if (search == "") setText("");
  }, [search]);
  // implement debouncing to prevent unnecessary api calls
  useEffect(() => {
    if (text) inputRef.current.focus();
    setSearch(debouncedText);
  }, [debouncedText]);

  return (
    <Input
      className="searchInput"
      ref={inputRef}
      value={text}
      allowClear
      placeholder={placeholder ?? "Search"}
      prefix={<img alt="searchBar" src={searchIcon} />}
      onChange={(e: any) => {
        setText(e.target.value);
      }}
    />
  );
};

export { UISearchBar, UISearchInput };
