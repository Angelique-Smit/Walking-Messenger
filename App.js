// In App.js in a new project

import * as React from 'react';

import {ThemeProvider} from './app/styling/colortheme.js';
import NavigationScreen from "./app/components/navigation.js";


function App() {

    return (
        <ThemeProvider>
        <NavigationScreen>
        </NavigationScreen>
        </ThemeProvider>
    );
}

export default App;