import React, { useState } from 'react';
import { Layout, Menu, Button, Space, Divider, Typography, Card } from 'antd';
import {
  HomeOutlined,
  ProjectOutlined,
  ToolOutlined,
  SettingOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ExpandOutlined,
} from '@ant-design/icons';
import { DesignCanvas } from './components/DesignCanvas/DesignCanvas';
import { Tool, CanvasState } from './types/design.types';
import { useCanvasStore } from './hooks/useCanvasStore';
import { Toolbar } from './components/Toolbar/Toolbar';
import { PropertyPanel } from './components/PropertyPanel/PropertyPanel';
import 'antd/dist/reset.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>({
    type: 'select',
    active: true,
    cursor: 'default',
  });

  const {
    viewport,
    setViewport,
    grid,
    setGrid,
    undo,
    redo,
    exportCanvas,
    clearCanvas,
  } = useCanvasStore();

  const [collapsed, setCollapsed] = useState(false);

  const handleCanvasStateChange = (state: CanvasState) => {
    // Handle canvas state changes if needed
    console.log('Canvas state changed:', state);
  };

  const handleZoomIn = () => {
    setViewport({ zoom: Math.min(viewport.zoom * 1.2, 3) });
  };

  const handleZoomOut = () => {
    setViewport({ zoom: Math.max(viewport.zoom / 1.2, 0.1) });
  };

  const handleFitToScreen = () => {
    setViewport({ zoom: 1, x: 0, y: 0 });
  };

  const handleToggleGrid = () => {
    setGrid({ enabled: !grid.enabled });
  };

  const handleSave = () => {
    const canvasData = exportCanvas();
    const blob = new Blob([canvasData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `house-design-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      {/* Header */}
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <HomeOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#1890ff' }} />
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              HouseBuilding AI Design System
            </Title>
          </div>
          <Space>
            <Button
              icon={<UndoOutlined />}
              onClick={undo}
              title="Undo (Ctrl+Z)"
            >
              Undo
            </Button>
            <Button
              icon={<RedoOutlined />}
              onClick={redo}
              title="Redo (Ctrl+Y)"
            >
              Redo
            </Button>
            <Divider type="vertical" />
            <Button
              icon={<ZoomOutOutlined />}
              onClick={handleZoomOut}
              title="Zoom Out"
            />
            <Button onClick={handleFitToScreen} title="Fit to Screen">
              {Math.round(viewport.zoom * 100)}%
            </Button>
            <Button
              icon={<ZoomInOutlined />}
              onClick={handleZoomIn}
              title="Zoom In"
            />
            <Button
              icon={<ExpandOutlined />}
              onClick={handleToggleGrid}
              title="Toggle Grid"
              type={grid.enabled ? 'primary' : 'default'}
            >
              Grid
            </Button>
            <Divider type="vertical" />
            <Button
              icon={<SaveOutlined />}
              onClick={handleSave}
              type="primary"
              title="Save Design"
            >
              Save Design
            </Button>
          </Space>
        </div>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={300}
          style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedTool.type]}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: 'select',
                icon: <ToolOutlined />,
                label: 'Select & Move',
                onClick: () => setSelectedTool({ type: 'select', active: true, cursor: 'default' }),
              },
              {
                key: 'wall',
                icon: <ToolOutlined />,
                label: 'Draw Walls',
                onClick: () => setSelectedTool({ type: 'wall', active: true, cursor: 'crosshair' }),
              },
              {
                key: 'door',
                icon: <ToolOutlined />,
                label: 'Add Doors',
                onClick: () => setSelectedTool({ type: 'door', active: true, cursor: 'crosshair' }),
              },
              {
                key: 'window',
                icon: <ToolOutlined />,
                label: 'Add Windows',
                onClick: () => setSelectedTool({ type: 'window', active: true, cursor: 'crosshair' }),
              },
              {
                key: 'room',
                icon: <HomeOutlined />,
                label: 'Define Rooms',
                onClick: () => setSelectedTool({ type: 'room', active: true, cursor: 'crosshair' }),
              },
              {
                key: 'measurement',
                icon: <ToolOutlined />,
                label: 'Measurements',
                onClick: () => setSelectedTool({ type: 'measurement', active: true, cursor: 'crosshair' }),
              },
            ]}
          />
        </Sider>

        {/* Main Content */}
        <Layout>
          <Content style={{ margin: '24px', background: '#fff', borderRadius: '8px' }}>
            <div style={{ padding: '16px', height: '100%' }}>
              <div style={{ marginBottom: '16px' }}>
                <Card title="AI-Integrated House Design Canvas" size="small">
                  <p style={{ margin: 0, color: '#666' }}>
                    Current Tool: <strong>{selectedTool.type.toUpperCase()}</strong> |
                    Grid: {grid.enabled ? 'ON' : 'OFF'} |
                    Snap to Grid: {grid.snap ? 'ON' : 'OFF'}
                  </p>
                </Card>
              </div>

              {/* Design Canvas */}
              <div style={{
                border: '2px solid #d9d9d9',
                borderRadius: '8px',
                overflow: 'hidden',
                height: 'calc(100vh - 240px)',
                background: '#fafafa'
              }}>
                <DesignCanvas
                  width={1200}
                  height={800}
                  tool={selectedTool}
                  onStateChange={handleCanvasStateChange}
                />
              </div>
            </div>
          </Content>
        </Layout>

        {/* Right Sidebar - Properties */}
        <Sider
          width={350}
          style={{ background: '#fff', borderLeft: '1px solid #f0f0f0', padding: '24px' }}
        >
          <PropertyPanel />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default App;