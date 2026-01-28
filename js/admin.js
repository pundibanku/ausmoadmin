import { db, collection, query, orderBy, onSnapshot, updateDoc, doc } from './firebase-admin.js';

document.addEventListener('DOMContentLoaded', () => {
    const ordersTableBody = document.getElementById('ordersTableBody');
    const totalOrdersEl = document.getElementById('totalOrders');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const pendingOrdersEl = document.getElementById('pendingOrders');
    const deliveredOrdersEl = document.getElementById('deliveredOrders');
    const searchInput = document.getElementById('searchInput');

    let allOrders = [];

    // Real-time listener for orders
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        allOrders = [];
        snapshot.forEach((doc) => {
            allOrders.push({ id: doc.id, ...doc.data() });
        });

        renderOrders(allOrders);
        updateStats(allOrders);
    }, (error) => {
        console.error("Firestore Error:", error);
        if (error.code === 'permission-denied') {
            alert("Firebase Rules allow nahi kar rahe! Please check your Firestore Rules.");
        } else {
            alert("Firebase Error: " + error.message);
        }
    });

    // Render Orders in Table
    function renderOrders(orders) {
        ordersTableBody.innerHTML = '';

        orders.forEach(order => {
            const tr = document.createElement('tr');

            const dateStr = order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';

            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${order.customerName}</strong></td>
                <td>${order.phoneNumber}</td>
                <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${order.address}</td>
                <td>₹${order.price}</td>
                <td>
                    <span class="status-badge status-${order.status?.toLowerCase() || 'pending'}">
                        ${order.status || 'Pending'}
                    </span>
                </td>
                <td>
                    <select onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            `;
            ordersTableBody.appendChild(tr);
        });
    }

    // Update Stats
    function updateStats(orders) {
        const total = orders.length;
        const revenue = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + (o.price || 0), 0);
        const pending = orders.filter(o => o.status === 'Pending' || !o.status).length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;

        totalOrdersEl.innerText = total;
        totalRevenueEl.innerText = `₹${revenue}`;
        pendingOrdersEl.innerText = pending;
        deliveredOrdersEl.innerText = delivered;
    }

    // Update Status in Firestore
    window.updateOrderStatus = async (orderId, newStatus) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                status: newStatus
            });
            console.log("Status updated to:", newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allOrders.filter(o =>
            o.customerName.toLowerCase().includes(term) ||
            o.phoneNumber.includes(term)
        );
        renderOrders(filtered);
    });
});
