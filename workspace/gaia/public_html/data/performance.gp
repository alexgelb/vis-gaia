set terminal png
set output "performance.png"

set title "Performance Evaluation"
set key top left

set grid ytics lc rgb 'black' lw 2 lt 0
set style line 1 dt 3 lw 2 pt 2 lc rgb 'green'
set style line 2 lt 1 lw 2 pt 6 ps 0.6 lc rgb 'red'
set style line 3 lt 2 lw 2 pt 4 ps 0.6 lc rgb 'blue'
set style line 4 lt 4 lw 2 pt 5 ps 0.4 lc rgb 'yellow'
set style line 5 lt 5 lw 2 pt 7 ps 0.7 lc rgb 'brown'

set xlabel "Dataset Size"
set ylabel "Time (in ms)"

set xtics rotate

plot "performance.dat" index 0 using 1:2 title "Dimension 2" with linespoints ls 1, \
	 "performance.dat" index 1 using 1:2 title "Dimension 4" with linespoints ls 2, \
	 "performance.dat" index 2 using 1:2 title "Dimension 6" with linespoints ls 3, \
	 "performance.dat" index 3 using 1:2 title "Dimension 8" with linespoints ls 4, \
	 "performance.dat" index 4 using 1:2 title "Dimension 10" with linespoints ls 5
