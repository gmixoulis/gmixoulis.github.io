type PerfCallback = (metric: { name: string; value: number }) => void;
const reportWebVitals = (cb?: PerfCallback) => {
  if (cb) import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(cb); onFID(cb); onFCP(cb); onLCP(cb); onTTFB(cb);
  });
};
export default reportWebVitals;
