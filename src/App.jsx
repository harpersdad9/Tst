import { useState, useCallback } from 'react';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './components/Dashboard';
import PlantList from './components/PlantList';
import PlantDetail from './components/PlantDetail';
import PlantForm from './components/PlantForm';
import CareLogView from './components/CareLogView';
import SettingsView from './components/SettingsView';
import QuickLogModal from './components/QuickLogModal';
import { usePlants } from './hooks/usePlants';
import { useCareLog } from './hooks/useCareLog';

export default function App() {
  const {
    plants,
    addPlant,
    updatePlant,
    deletePlant,
    logWater,
    logFertilizer,
    snoozePlant,
    getPlantById,
  } = usePlants();

  const {
    events,
    logWaterEvent,
    logFertilizerEvent,
    logNoteEvent,
    logRepotEvent,
    logPruneEvent,
    getEventsForPlant,
  } = useCareLog();

  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewStack, setViewStack] = useState([]); // stack of { view, params }

  // Quick log modal
  const [quickLogPlant, setQuickLogPlant] = useState(null);

  // Current view is top of stack or the tab view
  const currentView = viewStack.length > 0 ? viewStack[viewStack.length - 1] : null;

  const pushView = useCallback((view, params = {}) => {
    setViewStack((prev) => [...prev, { view, params }]);
  }, []);

  const popView = useCallback(() => {
    setViewStack((prev) => prev.slice(0, -1));
  }, []);

  const popToRoot = useCallback(() => {
    setViewStack([]);
  }, []);

  // Tab change clears view stack
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setViewStack([]);
  }, []);

  // Unified log water + event
  const handleLogWater = useCallback(
    (plantId) => {
      logWater(plantId);
      logWaterEvent(plantId);
    },
    [logWater, logWaterEvent]
  );

  // Unified log fertilizer + event
  const handleLogFertilizer = useCallback(
    (plantId) => {
      logFertilizer(plantId);
      logFertilizerEvent(plantId);
    },
    [logFertilizer, logFertilizerEvent]
  );

  // Quick log handlers
  const handleQuickLog = useCallback((plant) => {
    setQuickLogPlant(plant);
  }, []);

  const handleQuickLogWater = useCallback(
    (plantId) => {
      handleLogWater(plantId);
    },
    [handleLogWater]
  );

  const handleQuickLogFertilizer = useCallback(
    (plantId) => {
      handleLogFertilizer(plantId);
    },
    [handleLogFertilizer]
  );

  const handleQuickLogNote = useCallback(
    (plantId, note) => {
      logNoteEvent(plantId, note);
    },
    [logNoteEvent]
  );

  // View a plant detail
  const handleViewPlant = useCallback(
    (plantId) => {
      pushView('plant-detail', { plantId });
    },
    [pushView]
  );

  // Edit a plant
  const handleEditPlant = useCallback(
    (plantId) => {
      pushView('plant-edit', { plantId });
    },
    [pushView]
  );

  // Add a new plant
  const handleAddPlant = useCallback(() => {
    pushView('plant-add');
  }, [pushView]);

  // Save plant (add or edit)
  const handleSavePlant = useCallback(
    (formData) => {
      if (currentView?.view === 'plant-edit') {
        updatePlant(currentView.params.plantId, formData);
        popView(); // Go back to detail
      } else {
        const newPlant = addPlant(formData);
        popToRoot();
        // Navigate to new plant detail
        setTimeout(() => {
          handleViewPlant(newPlant.id);
        }, 50);
      }
    },
    [currentView, updatePlant, addPlant, popView, popToRoot, handleViewPlant]
  );

  // Delete plant
  const handleDeletePlant = useCallback(
    (plantId) => {
      deletePlant(plantId);
      popToRoot();
      setActiveTab('plants');
    },
    [deletePlant, popToRoot]
  );

  // Settings: clear all data
  const handleClearData = useCallback(() => {
    localStorage.removeItem('plants');
    localStorage.removeItem('careEvents');
    window.location.reload();
  }, []);

  // Settings: import data
  const handleImportData = useCallback((importedPlants, importedEvents) => {
    localStorage.setItem('plants', JSON.stringify(importedPlants));
    localStorage.setItem('careEvents', JSON.stringify(importedEvents));
    window.location.reload();
  }, []);

  // Render current view
  const renderView = () => {
    if (currentView) {
      switch (currentView.view) {
        case 'plant-detail': {
          const plant = getPlantById(currentView.params.plantId);
          if (!plant) return <PlantNotFound onBack={popView} />;
          const plantEvents = getEventsForPlant(plant.id);
          return (
            <PlantDetail
              plant={plant}
              careEvents={plantEvents}
              onBack={popView}
              onEdit={handleEditPlant}
              onDelete={handleDeletePlant}
              onLogWater={handleLogWater}
              onLogFertilizer={handleLogFertilizer}
              onLogNote={logNoteEvent}
              onLogRepot={logRepotEvent}
              onLogPrune={logPruneEvent}
            />
          );
        }
        case 'plant-edit': {
          const plant = getPlantById(currentView.params.plantId);
          if (!plant) return <PlantNotFound onBack={popView} />;
          return (
            <PlantForm
              plant={plant}
              onSave={handleSavePlant}
              onCancel={popView}
            />
          );
        }
        case 'plant-add':
          return (
            <PlantForm
              plant={null}
              onSave={handleSavePlant}
              onCancel={popView}
            />
          );
        default:
          return null;
      }
    }

    // Tab views
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            plants={plants}
            onAddPlant={handleAddPlant}
            onViewPlant={handleViewPlant}
            onQuickLog={handleQuickLog}
            onSnooze={snoozePlant}
          />
        );
      case 'plants':
        return (
          <PlantList
            plants={plants}
            onViewPlant={handleViewPlant}
            onAddPlant={handleAddPlant}
            onQuickLog={handleQuickLog}
          />
        );
      case 'log':
        return (
          <CareLogView
            events={events}
            plants={plants}
          />
        );
      case 'settings':
        return (
          <SettingsView
            plants={plants}
            events={events}
            onClearData={handleClearData}
            onImportData={handleImportData}
          />
        );
      default:
        return null;
    }
  };

  // Determine active tab for nav (hide nav on form pages)
  const hideNav = currentView?.view === 'plant-add' || currentView?.view === 'plant-edit';

  return (
    <div className="relative h-full">
      {/* Main content */}
      <div className={hideNav ? 'h-full' : 'pb-16'}>
        {renderView()}
      </div>

      {/* Bottom nav */}
      {!hideNav && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* Quick log modal */}
      {quickLogPlant && (
        <QuickLogModal
          plant={quickLogPlant}
          onClose={() => setQuickLogPlant(null)}
          onLogWater={handleQuickLogWater}
          onLogFertilizer={handleQuickLogFertilizer}
          onLogNote={handleQuickLogNote}
        />
      )}
    </div>
  );
}

function PlantNotFound({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
      <div className="text-5xl">🌵</div>
      <p className="font-bold text-forest text-lg">Plant not found</p>
      <button onClick={onBack} className="btn-secondary">Go Back</button>
    </div>
  );
}
