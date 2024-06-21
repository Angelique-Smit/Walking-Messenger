// React Imports
import * as React from 'react';

// Local Imports
import {ThemeProvider} from './app/styling/colortheme.js';
import NavigationScreen from "./app/components/navigation.js";

// Creates the app with a navigation screen inside that is surrounded by a themeprovider so it can use dark mode/light mode
function App() {
    return (
        <ThemeProvider>
        <NavigationScreen>
        </NavigationScreen>
        </ThemeProvider>
    );
}

// Exports the app
export default App;