import { useEffect, useRef } from 'react';
export default function usePrevious(value) {
    var ref = useRef();
    useEffect(function () {
        ref.current = value;
    });
    return ref.current;
}
