
import React, { useState } from 'react';
import { ServiceRecord, ServiceType, TireServiceType } from '../types';
import Card from './Card';
import ToggleSwitch from './ToggleSwitch';

interface ServiceAndRepairProps {
  records: ServiceRecord[];
  onAddRecord: (record: Omit<ServiceRecord, 'id'>) => void;
}

const ServiceAndRepair: React.FC<ServiceAndRepairProps> = ({ records, onAddRecord }) => {
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [odometer, setOdometer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [tireDetail, setTireDetail] = useState<TireServiceType | ''>('');
  const [tireCompany, setTireCompany] = useState('');
  const [tires, setTires] = useState({
    fl: false,
    fr: false,
    rl: false,
    rr: false,
    spare: false,
  });
  const [error, setError] = useState('');

  const handleServiceTypeChange = (type: ServiceType) => {
    const currentlyHasTire = serviceTypes.includes(ServiceType.TIRE);
    const newServiceTypes = serviceTypes.includes(type)
      ? serviceTypes.filter(t => t !== type)
      : [...serviceTypes, type];
    
    setServiceTypes(newServiceTypes);
    const nowHasTire = newServiceTypes.includes(ServiceType.TIRE);

    if (nowHasTire && !currentlyHasTire) {
      // Just added 'Tire' type
      setTireDetail(TireServiceType.NEW);
    } else if (!nowHasTire && currentlyHasTire) {
      // Just removed 'Tire' type
      setTireDetail('');
      setTires({ fl: false, fr: false, rl: false, rr: false, spare: false });
      setTireCompany('');
    }
  };
  
  const handleTireToggle = (tire: keyof typeof tires, checked: boolean) => {
    setTires(prev => ({ ...prev, [tire]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericCost = parseFloat(cost);
    const numericOdometer = parseInt(odometer, 10);
    const isTireService = serviceTypes.includes(ServiceType.TIRE);
    const tiresSelected = Object.values(tires).some(t => t);
    
    if (serviceTypes.length === 0) {
      setError('Please select at least one service type.');
      return;
    }
    
    if (isTireService && !tireDetail) {
      setError('Please select a tire detail.');
      return;
    }
    
    if(isTireService && !tiresSelected) {
      setError('Please select at least one tire.');
      return;
    }

    if (!isTireService && !description.trim()) {
        setError('Please enter a service description.');
        return;
    }

    if (isNaN(numericCost) || numericCost < 0 || isNaN(numericOdometer) || numericOdometer < 0 || !date) {
      setError('Please fill out all required fields with valid values.');
      return;
    }
    setError('');

    const serviceDate = new Date(date + 'T00:00:00');
    
    const recordToAdd: Omit<ServiceRecord, 'id'> = {
      date: serviceDate.toISOString(),
      description: isTireService ? tireDetail : description,
      cost: numericCost,
      odometer: numericOdometer,
      notes,
      serviceTypes,
    };
    
    if (isTireService) {
        recordToAdd.tires = tires;
        if (tireCompany.trim()) {
            recordToAdd.tireCompany = tireCompany.trim();
        }
    }

    onAddRecord(recordToAdd);

    setDescription('');
    setCost('');
    setOdometer('');
    setNotes('');
    setServiceTypes([]);
    setTireDetail('');
    setTireCompany('');
    setTires({ fl: false, fr: false, rl: false, rr: false, spare: false });
    setDate(new Date().toISOString().split('T')[0]);
  };

  const formatTireDescription = (record: ServiceRecord): string => {
    let baseDescription = record.description;

    if (record.serviceTypes.includes(ServiceType.TIRE)) {
      const tireAbbreviations = {
        fl: 'FL', fr: 'FR', rl: 'RL', rr: 'RR', spare: 'Spare',
      };
      const selectedTires = (Object.keys(record.tires || {}) as Array<keyof typeof tires>)
        .filter(key => record.tires && record.tires[key])
        .map(key => tireAbbreviations[key]);

      if (selectedTires.length > 0) {
        baseDescription = `${record.description} (${selectedTires.join(', ')})`;
      }
    }
    
    if (record.tireCompany) {
      return `${baseDescription} - ${record.tireCompany}`;
    }

    return baseDescription;
  };


  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const isTireService = serviceTypes.includes(ServiceType.TIRE);
  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white";

  return (
    <div className="space-y-8">
      <Card title="Log Service or Repair">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Type</label>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
              {Object.values(ServiceType).map((type) => (
                <label key={type} className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                    checked={serviceTypes.includes(type)}
                    onChange={() => handleServiceTypeChange(type)}
                  />
                  <span className="ml-2 text-sm text-gray-800 dark:text-gray-200">{type}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="service-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input type="date" id="service-date" value={date} onChange={e => setDate(e.target.value)} className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="service-odometer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Odometer (km)</label>
              <input type="number" id="service-odometer" value={odometer} onChange={e => setOdometer(e.target.value)} className={inputStyle} placeholder="e.g., 50000" required />
            </div>
          </div>
          
          {isTireService ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                    <label htmlFor="tire-detail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tire Detail</label>
                    <select 
                        id="tire-detail" 
                        value={tireDetail} 
                        onChange={e => setTireDetail(e.target.value as TireServiceType)} 
                        className={inputStyle} 
                        required
                    >
                      <option value="" disabled>Select tire service...</option>
                      {Object.values(TireServiceType).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tire Selection</label>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <ToggleSwitch id="fl" label="Front Left" checked={tires.fl} onChange={(c) => handleTireToggle('fl', c)} />
                        <ToggleSwitch id="fr" label="Front Right" checked={tires.fr} onChange={(c) => handleTireToggle('fr', c)} />
                        <ToggleSwitch id="rl" label="Rear Left" checked={tires.rl} onChange={(c) => handleTireToggle('rl', c)} />
                        <ToggleSwitch id="rr" label="Rear Right" checked={tires.rr} onChange={(c) => handleTireToggle('rr', c)} />
                        <ToggleSwitch id="spare" label="Spare" checked={tires.spare} onChange={(c) => handleTireToggle('spare', c)} />
                    </div>
                </div>
             </div>
          ) : (
            <div>
              <label htmlFor="service-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service/Repair Description</label>
              <input type="text" id="service-description" value={description} onChange={e => setDescription(e.target.value)} className={inputStyle} placeholder="e.g., Oil change, Brake inspection" required={!isTireService} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isTireService && (
                <div>
                    <label htmlFor="tire-company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tire Company</label>
                    <input type="text" id="tire-company" value={tireCompany} onChange={e => setTireCompany(e.target.value)} className={inputStyle} placeholder="e.g., Michelin" />
                </div>
            )}
            <div className={!isTireService ? 'md:col-span-2' : ''}>
                <label htmlFor="service-cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cost (NPR)</label>
                <input type="number" id="service-cost" value={cost} onChange={e => setCost(e.target.value)} className={inputStyle} placeholder="0.00" step="0.01" required />
            </div>
          </div>
          <div>
            <label htmlFor="service-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
            <textarea id="service-notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={inputStyle} placeholder="e.g., Used synthetic oil, next service due at 60000km"></textarea>
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex justify-end">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add Record
            </button>
          </div>
        </form>
      </Card>

      <Card title="Service History">
        {sortedRecords.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No service records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Odometer</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedRecords.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-wrap gap-1">
                        {(record.serviceTypes || []).map(type => (
                           <span key={type} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                type === ServiceType.SERVICING ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                type === ServiceType.REPAIRING ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                              }`}>
                                {type}
                            </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-sm text-sm text-gray-900 dark:text-white">
                      <div className="font-medium truncate">{formatTireDescription(record)}</div>
                      {record.notes && <div className="text-gray-500 dark:text-gray-400 text-xs truncate">{record.notes}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{record.odometer.toLocaleString()} km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 text-right">{new Intl.NumberFormat('ne-NP', { style: 'currency', currency: 'NPR' }).format(record.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ServiceAndRepair;
