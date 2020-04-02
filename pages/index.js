import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithDraftOrders from '../components/ResourceDraftorderList';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
  state = { open: false };
  app = this.context;
  render() {
    const app = this.context;
    const gotoCreate = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/create-quote',
      );
    };

    return (
      <Page
        title="Quote"
        primaryAction={{
          content: 'Create Quote',
          onAction: () => this.gotoCreate(),
        }}
      >
        <ResourceListWithDraftOrders />
      </Page>
    );
  }
  
  gotoCreate = () => {
    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.APP,
      '/create-quote',
    );
  };

}

export default Index;
