import { EmptyState, Layout, Page, Card, Tabs } from '@shopify/polaris';
import { Redirect } from '@shopify/app-bridge/actions';
import { ResourcePicker, TitleBar, Context } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithDraftOrders from '../components/ResourceDraftorderList';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
  state = { 
    open: false,
    selectedTab: 0,
  };

  handleTabChange = (selectedTab) => {
    this.setState({
      selectedTab
    });
  }

  render() {
    const app = this.context;
    const gotoCreate = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/create-quote',
      );
    };


    const tabs = [
      {
        id: 'requested-by-customer',
        content: 'Requested By Customer',
        accessibilityLabel: 'Requested By Customer',
        panelID: 'requested-by-customer-content',
        filter: 'all',
      },
      {
        id: 'approved',
        content: 'Approved',
        accessibilityLabel: 'Approved',
        panelID: 'approved-content',
        filter: 'approved',
      },
      {
        id: 'active',
        content: 'Active',
        accessibilityLabel: 'Active',
        panelID: 'active-content',
        filter: 'active',
      },
      {
        id: 'inactive',
        content: 'Inactive',
        accessibilityLabel: 'Inactive',
        panelID: 'inactive-content',
        filter: 'inactive',
      }
    ]

    return (
      <Page
        title="Quote"
        primaryAction={{
          content: 'Create Quote',
          onAction: () => gotoCreate(),
        }}
      >
        <Card>
          <Tabs tabs={tabs} selected={this.state.selectedTab} onSelect={this.handleTabChange}>
            <Card.Section>
              <ResourceListWithDraftOrders classify={tabs[this.state.selectedTab].filter} />
            </Card.Section>
          </Tabs>
        </Card>
      </Page>
    );
  }
}

export default Index;
