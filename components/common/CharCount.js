import React from "react";

const CharCount = ({current,total}) => {

    return (
        <div>
            <div className={`flex justify-end text-base mt-2 ${current>total? 'text-red-500':'text-black'}`}>{`${current}/${total}`}</div>
        </div>
    );
};
export default CharCount;