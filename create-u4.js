// Convert letters string to 2D array and find words in the grid
const letters = `
S W O R S E T A E C A U S E
O F I L A S E A R C H R C N
U N O E G R R D E G R E E O
T E O G A H E A T W E A V E
H N E R G X A V E R A G E I
C I M E T Y C E R E T A K S
E H R O A H H A C I N C I P
S S S W  H L A R E V E S R C
A N N A E U Y R E G A R D S
E U U N I F O R M I T E E U
R S S R O O D N I I E L N A
C O Q U I T E A C T I O N E
N E R C A P I T A L S T P R
I F I P T R E X T R E M E G`;

const words = `RUNWAY
SEVERAL
EXTREME
SEARCH
REACH
AVERAGE
ACTION
CAUSE
SUNSHINE
SOUTH
CAPITAL
UNIFORM
AREA
REGARDS
NORTH
HEATWEAVE
QUITE
DEGREE
INDOORS
INCREASE
WORSE
SKATE
FOGGY
PICNIC`.split('\n').filter(word => word.length > 0);

// Convert letters string to 2D array
const grid = letters.trim().split('\n').map(row => 
    row.trim().split(' ').filter(char => char.length > 0)
);

// ANSI escape codes for colors
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

// Function to print the grid with highlighted word
function printGridWithHighlight(grid, word, positions) {
    const width = grid[0].length;
    
    // Print column numbers
    console.log('   ', Array.from({length: width}, (_, i) => (i + 1).toString().padStart(2)).join(' '));
    console.log('    ' + '─'.repeat(width * 3));

    for (let i = 0; i < grid.length; i++) {
        // Print row number
        let row = `${(i + 1).toString().padStart(2)} │ `;
        
        for (let j = 0; j < grid[i].length; j++) {
            const isHighlighted = positions.some(pos => pos[0] === i && pos[1] === j);
            if (isHighlighted) {
                row += RED + grid[i][j] + RESET + ' ';
            } else {
                row += grid[i][j] + ' ';
            }
        }
        console.log(row);
    }
    console.log('    ' + '─'.repeat(width * 3));
    console.log(`Word found: ${word}\n`);
}

// Function to get all positions for a word based on its start, end, and direction
function getWordPositions(start, end) {
    const positions = [];
    const rowDiff = end[0] - start[0];
    const colDiff = end[1] - start[1];
    const length = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1;
    
    const rowStep = rowDiff === 0 ? 0 : rowDiff / (length - 1);
    const colStep = colDiff === 0 ? 0 : colDiff / (length - 1);
    
    for (let i = 0; i < length; i++) {
        positions.push([
            Math.round(start[0] + i * rowStep),
            Math.round(start[1] + i * colStep)
        ]);
    }
    
    return positions;
}

// Function to find a word in the grid
function findWord(grid, word) {
    const height = grid.length;
    const width = grid[0].length;
    
    // Check horizontal (left to right)
    for (let i = 0; i < height; i++) {
        for (let j = 0; j <= width - word.length; j++) {
            let match = true;
            for (let k = 0; k < word.length; k++) {
                if (grid[i][j + k].toLowerCase() !== word[k].toLowerCase()) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return {
                    word,
                    direction: 'horizontal (left to right)',
                    start: [i, j],
                    end: [i, j + word.length - 1]
                };
            }
        }
    }

    // Check horizontal (right to left)
    for (let i = 0; i < height; i++) {
        for (let j = width - 1; j >= word.length - 1; j--) {
            let match = true;
            for (let k = 0; k < word.length; k++) {
                if (grid[i][j - k].toLowerCase() !== word[k].toLowerCase()) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return {
                    word,
                    direction: 'horizontal (right to left)',
                    start: [i, j],
                    end: [i, j - word.length + 1]
                };
            }
        }
    }
    
    // Check vertical (top to bottom)
    for (let i = 0; i <= height - word.length; i++) {
        for (let j = 0; j < width; j++) {
            let match = true;
            for (let k = 0; k < word.length; k++) {
                if (grid[i + k][j].toLowerCase() !== word[k].toLowerCase()) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return {
                    word,
                    direction: 'vertical (top to bottom)',
                    start: [i, j],
                    end: [i + word.length - 1, j]
                };
            }
        }
    }

    // Check vertical (bottom to top)
    for (let i = height - 1; i >= word.length - 1; i--) {
        for (let j = 0; j < width; j++) {
            let match = true;
            for (let k = 0; k < word.length; k++) {
                if (grid[i - k][j].toLowerCase() !== word[k].toLowerCase()) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return {
                    word,
                    direction: 'vertical (bottom to top)',
                    start: [i, j],
                    end: [i - word.length + 1, j]
                };
            }
        }
    }

    // Check diagonal (top-left to bottom-right)
    for (let i = 0; i <= height - word.length; i++) {
        for (let j = 0; j <= width - word.length; j++) {
            let match = true;
            for (let k = 0; k < word.length; k++) {
                if (grid[i + k][j + k].toLowerCase() !== word[k].toLowerCase()) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return {
                    word,
                    direction: 'diagonal (top-left to bottom-right)',
                    start: [i, j],
                    end: [i + word.length - 1, j + word.length - 1]
                };
            }
        }
    }

    // Check diagonal (top-right to bottom-left)
    for (let i = 0; i <= height - word.length; i++) {
        for (let j = width - 1; j >= word.length - 1; j--) {
            let match = true;
            for (let k = 0; k < word.length; k++) {
                if (grid[i + k][j - k].toLowerCase() !== word[k].toLowerCase()) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return {
                    word,
                    direction: 'diagonal (top-right to bottom-left)',
                    start: [i, j],
                    end: [i + word.length - 1, j - word.length + 1]
                };
            }
        }
    }

    // Check diagonal (bottom-right to top-left)
    for (let i = height - 1; i >= word.length - 1; i--) {
        for (let j = width - 1; j >= word.length - 1; j--) {
            let match = true;
            for (let k = 0; k < word.length; k++) {
                if (grid[i - k][j - k].toLowerCase() !== word[k].toLowerCase()) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return {
                    word,
                    direction: 'diagonal (bottom-right to top-left)',
                    start: [i, j],
                    end: [i - word.length + 1, j - word.length + 1]
                };
            }
        }
    }

    // Check diagonal (bottom-left to top-right)
    for (let i = height - 1; i >= word.length - 1; i--) {
        for (let j = 0; j <= width - word.length; j++) {
            let match = true;
            for (let k = 0; k < word.length; k++) {
                if (grid[i - k][j + k].toLowerCase() !== word[k].toLowerCase()) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return {
                    word,
                    direction: 'diagonal (bottom-left to top-right)',
                    start: [i, j],
                    end: [i - word.length + 1, j + word.length - 1]
                };
            }
        }
    }
    
    return null;
}

// Find all words and print grids
console.log('Word Search Results:\n');
words.forEach((word, index) => {
    const result = findWord(grid, word);
    if (result) {
        console.log(`Found "${word}" - ${result.direction}`);
        console.log(`Start: Row ${result.start[0] + 1}, Column ${result.start[1] + 1}`);
        console.log(`End: Row ${result.end[0] + 1}, Column ${result.end[1] + 1}\n`);
        
        // Print grid with highlighted word
        const positions = getWordPositions(result.start, result.end);
        printGridWithHighlight(grid, word, positions);
    } else {
        console.log(`Could not find word "${word}"\n`);
    }
});
