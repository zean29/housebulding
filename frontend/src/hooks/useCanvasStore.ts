import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CanvasState, CanvasElement, Point, Tool } from '../types/design.types';

interface CanvasStore extends CanvasState {
  // Actions
  setElements: (elements: CanvasElement[]) => void;
  setSelectedElements: (ids: string[]) => void;
  setViewport: (viewport: Partial<CanvasState['viewport']>) => void;
  setGrid: (grid: Partial<CanvasState['grid']>) => void;
  setMeasurements: (measurements: Partial<CanvasState['measurements']>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  addElement: (element: CanvasElement) => void;
  moveElements: (ids: string[], deltaX: number, deltaY: number) => void;
  duplicateElements: (ids: string[]) => void;

  // History/Undo-Redo
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;

  // Utility
  clearCanvas: () => void;
  exportCanvas: () => string;
  importCanvas: (data: string) => void;
}

const initialState: CanvasState = {
  elements: [],
  selectedElements: [],
  viewport: {
    x: 0,
    y: 0,
    zoom: 1,
  },
  grid: {
    enabled: true,
    size: 20,
    snap: true,
  },
  measurements: {
    show: true,
    unit: 'mm',
  },
};

export const useCanvasStore = create<CanvasStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setElements: (elements) => {
      set({ elements });
      get().saveHistory();
    },

    setSelectedElements: (selectedElements) => {
      set({ selectedElements });
    },

    setViewport: (viewport) => {
      set((state) => ({
        viewport: { ...state.viewport, ...viewport },
      }));
    },

    setGrid: (grid) => {
      set((state) => ({
        grid: { ...state.grid, ...grid },
      }));
    },

    setMeasurements: (measurements) => {
      set((state) => ({
        measurements: { ...state.measurements, ...measurements },
      }));
    },

    updateElement: (id, updates) => {
      set((state) => ({
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ),
      }));
      get().saveHistory();
    },

    deleteElement: (id) => {
      set((state) => ({
        elements: state.elements.filter((el) => el.id !== id),
        selectedElements: state.selectedElements.filter((elId) => elId !== id),
      }));
      get().saveHistory();
    },

    addElement: (element) => {
      set((state) => ({
        elements: [...state.elements, element],
      }));
      get().saveHistory();
    },

    moveElements: (ids, deltaX, deltaY) => {
      set((state) => ({
        elements: state.elements.map((el) => {
          if (ids.includes(el.id)) {
            // Different logic based on element type
            switch (el.type) {
              case 'wall':
                return {
                  ...el,
                  startPoint: {
                    x: el.startPoint.x + deltaX,
                    y: el.startPoint.y + deltaY,
                  },
                  endPoint: {
                    x: el.endPoint.x + deltaX,
                    y: el.endPoint.y + deltaY,
                  },
                };
              case 'door':
              case 'window':
                return {
                  ...el,
                  position: {
                    x: el.position.x + deltaX,
                    y: el.position.y + deltaY,
                  },
                };
              case 'room':
                return {
                  ...el,
                  vertices: el.vertices.map((vertex) => ({
                    x: vertex.x + deltaX,
                    y: vertex.y + deltaY,
                  })),
                };
              default:
                return el;
            }
          }
          return el;
        }),
      }));
    },

    duplicateElements: (ids) => {
      const { elements } = get();
      const elementsToDuplicate = elements.filter((el) => ids.includes(el.id));
      const duplicatedElements = elementsToDuplicate.map((el) => {
        const newId = `${el.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Add offset to duplicated elements
        const offsetX = 50;
        const offsetY = 50;

        switch (el.type) {
          case 'wall':
            return {
              ...el,
              id: newId,
              startPoint: {
                x: el.startPoint.x + offsetX,
                y: el.startPoint.y + offsetY,
              },
              endPoint: {
                x: el.endPoint.x + offsetX,
                y: el.endPoint.y + offsetY,
              },
            };
          case 'door':
          case 'window':
            return {
              ...el,
              id: newId,
              position: {
                x: el.position.x + offsetX,
                y: el.position.y + offsetY,
              },
            };
          case 'room':
            return {
              ...el,
              id: newId,
              vertices: el.vertices.map((vertex) => ({
                x: vertex.x + offsetX,
                y: vertex.y + offsetY,
              })),
            };
          default:
            return { ...el, id: newId };
        }
      });

      set((state) => ({
        elements: [...state.elements, ...duplicatedElements],
        selectedElements: duplicatedElements.map((el) => el.id),
      }));
      get().saveHistory();
    },

    // History management
    history: {
      past: [],
      present: null,
      future: [],
    },

    saveHistory: () => {
      const { elements, history } = get();
      const newHistory = {
        past: [...history.past.slice(-49), elements], // Keep last 50 states
        present: elements,
        future: [],
      };
      set({ history: newHistory });
    },

    undo: () => {
      const { history } = get();
      if (history.past.length === 0) return;

      const previous = history.past[history.past.length - 1];
      const newPast = history.past.slice(0, history.past.length - 1);

      set({
        elements: previous,
        selectedElements: [],
        history: {
          past: newPast,
          present: previous,
          future: [...history.future, history.present],
        },
      });
    },

    redo: () => {
      const { history } = get();
      if (history.future.length === 0) return;

      const next = history.future[history.future.length - 1];
      const newFuture = history.future.slice(0, history.future.length - 1);

      set({
        elements: next,
        selectedElements: [],
        history: {
          past: [...history.past, history.present],
          present: next,
          future: newFuture,
        },
      });
    },

    clearCanvas: () => {
      set({
        elements: [],
        selectedElements: [],
        viewport: initialState.viewport,
      });
      get().saveHistory();
    },

    exportCanvas: () => {
      const { elements, viewport, grid, measurements } = get();
      const exportData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        elements,
        viewport,
        grid,
        measurements,
      };
      return JSON.stringify(exportData, null, 2);
    },

    importCanvas: (data) => {
      try {
        const importData = JSON.parse(data);

        // Validate import data
        if (!importData.elements || !Array.isArray(importData.elements)) {
          throw new Error('Invalid import data format');
        }

        set({
          elements: importData.elements || [],
          viewport: importData.viewport || initialState.viewport,
          grid: importData.grid || initialState.grid,
          measurements: importData.measurements || initialState.measurements,
          selectedElements: [],
        });

        get().saveHistory();
      } catch (error) {
        console.error('Failed to import canvas data:', error);
        throw error;
      }
    },
  }))
);